// export * from './website.config';
// export * from './website.s3bucket';

import { config } from 'dotenv';
import pkg from 'fs-extra';
const {
  emptyDirSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  writeFileSync,
} = pkg;
import { join, dirname } from 'path';
import esbuild from 'esbuild';


/**
 * @typedef {{
 *  artifactPath?: string;
 *  autoDeploy?: boolean;
 *  iacPath?: string;
 *  stackName?: string;
 *  serverHeaders?: string[];
 *  staticHeaders?: string[];
 *  esbuildOptions?: any;
 *  FQDN?: string;
 *  LOG_RETENTION_DAYS?: number;
 *  MEMORY_SIZE?: number;
 *  zoneName?: string;
 *  env?: { [key: string]: string };
 * }} AWSAdapterProps
 */

const url = new URL('', import.meta.url);
const __dirname = url.pathname.replace('/index.js', '');
console.log(__dirname);

/**
 * Sveltekit adapter that is used in `svelte.config.js`.
 * @param {AWSAdapterProps} args
 */
export const adapter = (args) => {
  const {
    artifactPath = 'build',
    autoDeploy = false,
    iacPath = `${__dirname}/web.js`,
    stackName = 'sveltekit-adapter-aws-app',
    serverHeaders = [
      'Accept',
      'Accept-Charset',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Accept-Datetime',
      'Accept-Language',
      'Origin',
      'Referer',
    ],
    staticHeaders = ['User-Agent', 'Referer'],
    esbuildOptions = {},
    FQDN,
    MEMORY_SIZE,
    // LOG_RETENTION_DAYS,
    zoneName = '',
    env = {},
  } = args ?? {};
  
  /** @type {import('@sveltejs/kit').Adapter} */
  return {
    name: '@freedev/adapter-aws-pulumi',
    /**
     * @param {any} builder 
     */
    async adapt(builder) {
      // Get `.env`
      const environment = config({ path: join(process.cwd(), '.env') });

      // Empty build directory
      emptyDirSync(artifactPath);

      // Create assets directory
      const static_directory = join(artifactPath, 'assets');
      if (!existsSync(static_directory)) {
        mkdirSync(static_directory, { recursive: true });
      }

      // Create prerendered directory
      const prerendered_directory = join(artifactPath, 'prerendered');
      if (!existsSync(prerendered_directory)) {
        mkdirSync(prerendered_directory, { recursive: true });
      }

      // Create server directory
      const server_directory = join(artifactPath, 'server');
      if (!existsSync(server_directory)) {
        mkdirSync(server_directory, { recursive: true });
      }

      builder.log.minor('dirname: ', __dirname);

      const clientFiles = await builder.writeClient(static_directory);
      builder.log.minor('✅ Copied asset files.');

      builder.log.minor('Copying server files.');
      await builder.writeServer(artifactPath);
      copyFileSync(`${__dirname}/functions/serverless.js`, `${server_directory}/_index.js`);
      copyFileSync(`${__dirname}/functions/shims.js`, `${server_directory}/shims.js`);

      esbuild.buildSync({
        entryPoints: [`${server_directory}/_index.js`],
        outfile: `${server_directory}/index.js`,
        inject: [join(`${server_directory}/shims.js`)],
        external: ['node:*', ...(esbuildOptions?.external ?? [])],
        format: esbuildOptions?.format ?? 'cjs',
        banner: esbuildOptions?.banner ?? {},
        bundle: true,
        platform: 'node',
        target: esbuildOptions?.target ?? 'node16',
        treeShaking: true,
      });
      builder.log.minor('✅ Buit AWS Lambda server function.');

      builder.log.minor('Prerendering static pages.');
      const prerenderedFiles = await builder.writePrerendered(prerendered_directory);

      unlinkSync(`${server_directory}/_index.js`);
      unlinkSync(`${artifactPath}/index.js`);
      builder.log.minor('✅ Cleaned up project.');

      const routes = [
        ...new Set(
          [...clientFiles, ...prerenderedFiles]
            .map((x) => {
              const z = dirname(x);
              if (z === '.') return x;
              if (z.includes('/')) return undefined;
              return `${z}/*`;
            })
            .filter(Boolean)
        ),
      ];
      writeFileSync(join(artifactPath, 'routes.json'), JSON.stringify(routes));
      builder.log.minor('✅ Exported routes.');

      builder.log.minor('🔄 Deploy via Pulumi.');
      /** @type {any} default_env */
      const default_env = {
        PROJECT_PATH: join(process.cwd(), '.env'),
        SERVER_PATH: join(process.cwd(), server_directory),
        STATIC_PATH: join(process.cwd(), static_directory),
        PRERENDERED_PATH: join(process.cwd(), prerendered_directory),
        ROUTES: routes,
        SERVER_HEADERS: serverHeaders,
        STATIC_HEADERS: staticHeaders,
        FQDN,
        MEMORY_SIZE,
        ZONE_NAME: zoneName,
      };

      // spawnSync('pulumi', ['up', '-s', stackName, '-f', '-y'], {
      //   cwd: iacPath,
      //   stdio: [process.stdin, process.stdout, process.stderr],
      //   env: Object.assign(default_env, process.env, env),
      // });

      writeFileSync(
        join(artifactPath, '.adapterprops.json'),
        JSON.stringify({
          iacPath,
          stackName,
        })
      );

      builder.log.minor('✅ Pulumi deployment done.');
    },
  };
}