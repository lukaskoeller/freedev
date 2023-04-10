// @ts-check
import pkg from 'fs-extra';
const {
  emptyDirSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  writeFileSync,
  readdirSync,
  statSync,
} = pkg;
import {
  join,
  resolve,
  sep,
  posix,
} from 'path';
import esbuild from 'esbuild';
import { LocalWorkspace } from '@pulumi/pulumi/automation/index.js'

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
    stackName = 'dev',
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
    esbuildOptions = {},
    FQDN,
    MEMORY_SIZE,
    // LOG_RETENTION_DAYS,
    zoneName = '', // eu-central-1
    env = {},
  } = args ?? {};
  
  /** @type {import('@sveltejs/kit').Adapter} */
  return {
    name: '@freedev/adapter-aws-pulumi',
    /**
     * @param {any} builder 
     */
    async adapt(builder) {

      // #️⃣ Set up server

      // Empty build directory
      emptyDirSync(artifactPath);

      // Create assets directory
      const static_directory = resolve(artifactPath, 'assets');
      if (!existsSync(static_directory)) {
        mkdirSync(static_directory, { recursive: true });
      }

      // Create prerendered directory
      const prerendered_directory = resolve(artifactPath, 'prerendered');
      if (!existsSync(prerendered_directory)) {
        mkdirSync(prerendered_directory, { recursive: true });
      }

      // Create server directory
      const server_directory = resolve(artifactPath, 'server');
      if (!existsSync(server_directory)) {
        mkdirSync(server_directory, { recursive: true });
      }

      builder.log.minor('dirname: ', __dirname);

      const clientFiles = await builder.writeClient(static_directory);
      builder.log.minor('✅ Copied asset files.');

      await builder.writeServer(artifactPath);
      copyFileSync(`${__dirname}/functions/serverless.js`, `${server_directory}/_index.js`);
      copyFileSync(`${__dirname}/functions/shims.js`, `${server_directory}/shims.js`);
      builder.log.minor('✅ Copied server files.');

      esbuild.buildSync({
        entryPoints: [`${server_directory}/_index.js`],
        outfile: `${server_directory}/index.js`,
        inject: [join(`${server_directory}/shims.js`)],
        external: ['node:*', ...(esbuildOptions?.external ?? [])],
        format: esbuildOptions?.format ?? 'cjs',
        banner: esbuildOptions?.banner ?? {},
        bundle: true,
        platform: 'node',
        target: esbuildOptions?.target ?? 'node18',
        treeShaking: true,
      });
      builder.log.minor('✅ Buit AWS Lambda server function.');

      builder.log.minor('Prerendering static pages.');
      const prerenderedFiles = await builder.writePrerendered(prerendered_directory);

      unlinkSync(`${server_directory}/_index.js`);
      unlinkSync(`${artifactPath}/index.js`);
      builder.log.minor('✅ Cleaned up project.');

      // #️⃣ Set up options
      const options_directory = resolve(artifactPath, 'options')
      if (!existsSync(options_directory)) {
        mkdirSync(options_directory, { recursive: true });
      }

      copyFileSync(
        `${__dirname}/functions/options.js`,
        `${options_directory}/_options.js`
      );

      esbuild.buildSync({
        entryPoints: [`${options_directory}/_options.js`],
        outfile: `${options_directory}/options.js`,
        format: 'cjs',
        bundle: true,
        platform: 'node',
      });
      builder.log.minor('✅ Built options router.');

      unlinkSync(`${options_directory}/_options.js`)
      builder.log.minor('✅ Cleaned up options.');

      if (autoDeploy) {
        const {
          serverDomain: serverURL,
          optionsDomain: optionsURL,
          serverStack,
          serverPath,
        } = await deployServerStack({
          __dirname,
          stackName,
          zoneName,
          server_directory,
          options_directory,
          MEMORY_SIZE,
        });

        // #️⃣ Set up routes
        const edge_directory = resolve(artifactPath, 'edge');
        if (!existsSync(edge_directory)) {
          mkdirSync(edge_directory, { recursive: true });
        }

        copyFileSync(
          `${__dirname}/functions/router.js`,
          `${edge_directory}/_router.js`
        );
        let files = JSON.stringify([
          ...getAllFiles({ dirPath: static_directory }),
          ...getAllFiles({ dirPath: prerendered_directory }),
        ])
        writeFileSync(`${edge_directory}/static.js`, `export default ${files}`);

        esbuild.buildSync({
          entryPoints: [`${edge_directory}/_router.js`],
          outfile: `${edge_directory}/router.js`,
          define: {
            SERVER_URL: `"${serverURL}"`,
            OPTIONS_URL: `"${optionsURL}"`,
          },
          format: 'cjs',
          bundle: true,
          platform: 'node',
        });
        builder.log.minor('✅ Built router.');

        unlinkSync(`${edge_directory}/_router.js`);
        builder.log.minor('✅ Clean up project.');

        const {
          mainAllowedOrigins,
          mainPath,
        } = await deployMainStack({
          stackName,
          zoneName,
          edge_directory,
          static_directory,
          prerendered_directory,
          FQDN,
          serverHeaders,
        });

        await deployServerStackUpdate({
          serverStack,
          mainAllowedOrigins,
        });

        const adapterProps = {
          iacPaths: [serverPath, mainPath],
          stackName,
        }
        writeFileSync(
          join(artifactPath, '.adapterprops.json'),
          JSON.stringify(adapterProps)
        );
      }
    },
  };
}

/**
 * @typedef {{
 *  dirPath: string
 *  basePath?: string
 *  arrayOfFiles?: string[]
 * }} GetAllFilesArgs
 * 
 * @param {GetAllFilesArgs} args 
 * @returns {Required<GetAllFilesArgs>["arrayOfFiles"]} array of files
 */
const getAllFiles = function ({
  dirPath,
  basePath = dirPath,
  arrayOfFiles: baseFiles,
}) {
  let arrayOfFiles = baseFiles || [];
  const files = readdirSync(dirPath);

  files.forEach(function (file) {
    const fileOrDir = join(dirPath, file)
    if (statSync(fileOrDir).isDirectory()) {
      arrayOfFiles = getAllFiles({ dirPath: fileOrDir, basePath, arrayOfFiles });
    } else {
      const uriLocal = join(sep, dirPath.replace(basePath, ''), file);
      const uriPosix = uriLocal.split(sep).join(posix.sep);
      arrayOfFiles.push(uriPosix);
    }
  });

  return arrayOfFiles;
}

/**
 * 
 * @param {{
 *  __dirname: string
 *  stackName: Required<AWSAdapterProps>["stackName"]
 *  zoneName: Required<AWSAdapterProps>["zoneName"]
 *  server_directory: string
 *  options_directory: string
 *  MEMORY_SIZE?: AWSAdapterProps["MEMORY_SIZE"]
 * }} deployServerStackArgs 
 * @returns {Promise<{
 *  serverStack: import('@pulumi/pulumi/automation/index.js').Stack
 *  serverDomain: string
 *  optionsDomain: string
 *  serverPath: string
 * }>}
 */
async function deployServerStack({
  __dirname,
  stackName,
  zoneName,
  server_directory,
  options_directory,
  MEMORY_SIZE,
}) {
  // Setup server stack.
  const serverPath = join(__dirname, 'stacks', 'server')
  /** @type {import('@pulumi/pulumi/automation/index.js').LocalProgramArgs} */
  const serverArgs = {
    stackName: stackName,
    workDir: serverPath,
  };

  const serverStack = await LocalWorkspace.createOrSelectStack(
    serverArgs,
    {
      envVars: {
        'TS_NODE_IGNORE': '^(?!.*(sveltekit-adapter-aws-pulumi)).*'
      }
    },
  );

  // Set the AWS region.
  await serverStack.setConfig("aws:region", { value: zoneName });

  await serverStack.setAllConfig({
    projectPath: { value: '.env' },
    serverPath: { value: server_directory },
    optionsPath: { value: options_directory },
    memorySizeStr: { value: String(MEMORY_SIZE) },
  });


  const serverStackUpResult = await serverStack.up({
    onOutput: console.info,
  });

  return {
    serverDomain: serverStackUpResult.outputs.serverDomain.value,
    optionsDomain: serverStackUpResult.outputs.optionsDomain.value,
    serverStack,
    serverPath,
  };
}

/**
 * 
 * @param {{
 *  stackName: Required<AWSAdapterProps>["stackName"]
 *  zoneName: Required<AWSAdapterProps>["zoneName"]
 *  edge_directory: string
 *  static_directory: string
 *  prerendered_directory: string
 *  FQDN?: AWSAdapterProps["FQDN"]
 *  serverHeaders: Required<AWSAdapterProps>["serverHeaders"]
 * }} deployMainStackArgs 
 * @returns {Promise<{
 *  mainAllowedOrigins: string
 *  mainPath: string
 * }>}
 */
async function deployMainStack({
  stackName,
  zoneName,
  edge_directory,
  static_directory,
  prerendered_directory,
  FQDN,
  serverHeaders,
}) {
  const mainPath = join(__dirname, 'stacks', 'main')
  /** @type {import('@pulumi/pulumi/automation/index.js').LocalProgramArgs} */
  const mainArgs = {
    stackName: stackName,
    workDir: mainPath,
  }
  const mainStack = await LocalWorkspace.createOrSelectStack(
    mainArgs,
    {
      envVars: {
        'TS_NODE_IGNORE': '^(?!.*(sveltekit-adapter-aws-pulumi)).*'
      }
    })

  // Set the AWS region.
  await mainStack.setConfig("aws:region", { value: zoneName });

  await mainStack.setAllConfig({
    edgePath: { value: edge_directory },
    staticPath: { value: static_directory },
    prerenderedPath: { value: prerendered_directory },
  });

  if (FQDN) {
    await mainStack.setConfig('FQDN', { value: FQDN });
  }

  if (serverHeaders) {
    await mainStack.setConfig('serverHeaders', {
      value: JSON.stringify(serverHeaders),
    });
  }

  const mainStackUpResult = await mainStack.up({ onOutput: console.info });
  const mainAllowedOrigins = JSON.stringify(mainStackUpResult.outputs.allowedOrigins.value);

  return {
    mainAllowedOrigins,
    mainPath,
  };
};

/**
 * 
 * @param {{
 *  serverStack: import('@pulumi/pulumi/automation/index.js').Stack
 *  mainAllowedOrigins: string
 * }} DeployServerStackUpdate 
 */
async function deployServerStackUpdate({
  serverStack,
  mainAllowedOrigins,
}) {
  let serverAllowedOrigins = '';
  const serverConfig = await serverStack.getAllConfig()
  
  if ('allowedOrigins' in serverConfig){
    serverAllowedOrigins = serverConfig['allowedOrigins'].value
  }
  
  if (serverAllowedOrigins !== mainAllowedOrigins) {
    // Call the server stack setting the allowed origins
    await serverStack.setConfig('allowedOrigins', {
      value: mainAllowedOrigins,
    })

    const serverStackUpUpdate = await serverStack.up({
      onOutput: console.info,
    })
  }
}