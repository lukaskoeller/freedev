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

export type AWSAdapterProps = {
  artifactPath?: string;
  autoDeploy?: boolean;
  iacPath?: string;
  stackName?: string;
  defaultHeaders?: string[];
  extraHeaders?: string[];
  esbuildOptions?: any;
  FQDN?: string;
  memorySize?: number;
  region?: string;
  env?: { [key: string]: string };
}

/**
 * @typedef {{
 *  artifactPath?: string;
 *  autoDeploy?: boolean;
 *  iacPath?: string;
 *  stackName?: string;
 *  defaultHeaders?: string[];
 *  extraHeaders?: string[];
 *  esbuildOptions?: any;
 *  FQDN?: string;
 *  memorySize?: number;
 *  region?: string;
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
export const adapter = (args: AWSAdapterProps) => {
  const {
    artifactPath = 'build',
    autoDeploy = false,
    stackName = 'dev',
    defaultHeaders = [
      'Accept',
      'Accept-Language',
      'If-None-Match',
      'Host',
      'Origin',
      'Referer',
      'X-Forwarded-Host',
    ],
    extraHeaders = new Array(),
    esbuildOptions = {},
    FQDN,
    memorySize,
    region = 'eu-central-1',
    env = {},
  } = args ?? {};
  
  /** @type {import('@sveltejs/kit').Adapter} */
  return {
    name: '@freedev/adapter-aws-pulumi',
    /**
     * @param {import('@sveltejs/kit').Builder} builder 
     */
    async adapt(builder: import('@sveltejs/kit').Builder) {
      const {
        server_directory,
        static_directory,
        prerendered_directory,
      } =await buildServer(
        builder,
        artifactPath,
        esbuildOptions,
        __dirname,
      );

      const options_directory = await buildOptions(builder, artifactPath);

      if (autoDeploy) {
        const {
          serverDomain: serverURL,
          optionsDomain: optionsURL,
          serverArn,
          optionsArn,
          serverStack,
          serverPath,
        } = await deployServerStack({
          __dirname,
          stackName,
          region,
          server_directory,
          options_directory,
          memorySize,
        });

        const edge_directory = buildRouter(
          builder,
          artifactPath,
          static_directory,
          prerendered_directory,
          serverURL,
          optionsURL,
        );

        const {
          mainAllowedOrigins,
          mainPath,
        } = await deployMainStack({
          stackName,
          region,
          edge_directory,
          static_directory,
          prerendered_directory,
          FQDN,
          defaultHeaders,
          extraHeaders,
          serverArn,
          optionsArn,
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

        builder.log.minor('Pulumi deployment done.')
      }
    },
  };
}

export type SiteProps = {
  server_directory: string;
  static_directory: string;
  prerendered_directory: string;
}

/**
 * @typedef {{
 *  server_directory: string;
 *  static_directory: string;
 *  prerendered_directory: string;
 * }} SiteProps
 */

/**
 * Prepare SvelteKit SSR server files for deployment to AWS services.
 *
 * To determine the URL request origin the server uses the following hierarchy:
 * + The ORIGIN environment variable
 * + The value of the 'X-Forwarded-Host' header
 * + The domain name within the request event
 *
 * The origin value is important to prevent CORS errors.
 *
 * @param {import('@sveltejs/kit').Builder} builder Provided by [Sveltektit](https://kit.svelte.dev/docs/types#public-types-builder)
 * @param {string} artifactPath The path where to place to SvelteKit files
 * @param {any} esbuildOptions Options to pass to esbuild
 * @param {string} __dirname
 * @returns {Promise<SiteProps>}
 */
const buildServer = async (
  builder: import('@sveltejs/kit').Builder,
  artifactPath: string = 'build',
  esbuildOptions: any = {},
  __dirname: string,
): Promise<SiteProps> => {
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

  return {
    server_directory,
    static_directory,
    prerendered_directory,
  }
};

/**
 * Prepare options handler for deployment to AWS services
 * @param {import('@sveltejs/kit').Builder} builder Provided by [Sveltektit](https://kit.svelte.dev/docs/types#public-types-builder)
 * @param {string} artifactPath The path where to place to SvelteKit files
 * @returns {Promise<string>} Location of files for the options handler
 */
const buildOptions = async (
  builder: import('@sveltejs/kit').Builder,
  artifactPath: string = 'build',
): Promise<string> => {
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
    outfile: `${options_directory}/index.js`,
    format: 'cjs',
    bundle: true,
    platform: 'node',
  });
  builder.log.minor('✅ Built options router.');

  unlinkSync(`${options_directory}/_options.js`)
  builder.log.minor('✅ Cleaned up options.');

  return options_directory;
};

/**
 * 
 * @param {import('@sveltejs/kit').Builder} builder Provided by [Sveltektit](https://kit.svelte.dev/docs/types#public-types-builder)
 * @param {string} artifactPath The path where to place to SvelteKit files
 * @param {string} static_directory 
 * @param {string} prerendered_directory 
 * @param {string} serverURL 
 * @param {string} optionsURL 
 */
const buildRouter = (
  builder: import('@sveltejs/kit').Builder,
  artifactPath: string,
  static_directory: string,
  prerendered_directory: string,
  serverURL: string,
  optionsURL: string,
) => {
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

  return edge_directory;
};

export type GetAllFilesArgs = {
  dirPath: string;
  basePath?: string;
  arrayOfFiles?: string[];
}

/**
 * @typedef {{
 *  dirPath: string;
 *  basePath?: string;
 *  arrayOfFiles?: string[];
 * }} GetAllFilesArgs
 * 
 * @param {GetAllFilesArgs} args 
 * @returns {Required<GetAllFilesArgs>["arrayOfFiles"]} array of files
 */
const getAllFiles = function ({
  dirPath,
  basePath = dirPath,
  arrayOfFiles: baseFiles,
}: GetAllFilesArgs): Required<GetAllFilesArgs>["arrayOfFiles"] {
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
 *  region: Required<AWSAdapterProps>["region"]
 *  server_directory: string
 *  options_directory: string
 *  memorySize?: AWSAdapterProps["memorySize"]
 * }} deployServerStackArgs 
 * @returns {Promise<{
 *  serverStack: import('@pulumi/pulumi/automation/index.js').Stack
 *  serverDomain: string
 *  optionsDomain: string
 *  serverArn: string
 *  optionsArn: string
 *  serverPath: string
 * }>}
 */
async function deployServerStack({
  __dirname,
  stackName,
  region,
  server_directory,
  options_directory,
  memorySize,
}: {
    __dirname: string;
    stackName: Required<AWSAdapterProps>["stackName"];
    region: Required<AWSAdapterProps>["region"];
    server_directory: string;
    options_directory: string;
    memorySize?: AWSAdapterProps["memorySize"];
  }): Promise<{
  serverStack: import('@pulumi/pulumi/automation/index.js').Stack;
  serverDomain: string;
  optionsDomain: string;
  serverArn: string;
  optionsArn: string;
  serverPath: string;
}> {
  // Setup server stack.
  const serverPath = join(__dirname, 'stacks', 'server');
  /** @type {import('@pulumi/pulumi/automation/index.js').LocalProgramArgs} */
  const serverArgs: import('@pulumi/pulumi/automation/index.js').LocalProgramArgs = {
    stackName: stackName,
    workDir: serverPath,
  };

  console.log('enter serverStack', serverArgs);
  const serverStack = await LocalWorkspace.createOrSelectStack(
    serverArgs,
    {
      envVars: {
        TS_NODE_IGNORE: '^(?!.*(@freedev/sveltekit-adapter)).*',
        TS_NODE_TYPE_CHECK: '0',
        PULUMI_NODEJS_TRANSPILE_ONLY: 'true',
      }
    },
  );
  console.log('serverStack', serverStack);

  // Set the AWS region.
  await serverStack.setConfig("aws:region", { value: region });

  await serverStack.setAllConfig({
    projectPath: { value: '.env' },
    serverPath: { value: server_directory },
    optionsPath: { value: options_directory },
    memorySizeStr: { value: String(memorySize) },
  });

  await serverStack.refresh();
  const serverStackUpResult = await serverStack.up({
    onOutput: console.info,
  });

  return {
    serverDomain: serverStackUpResult.outputs.serverDomain.value,
    optionsDomain: serverStackUpResult.outputs.optionsDomain.value,
    serverArn: serverStackUpResult.outputs.serverArn.value,
    optionsArn: serverStackUpResult.outputs.optionsArn.value,
    serverStack,
    serverPath,
  };
}

/**
 * 
 * @param {{
 *  stackName: Required<AWSAdapterProps>["stackName"]
 *  region: Required<AWSAdapterProps>["region"]
 *  edge_directory: string
 *  static_directory: string
 *  prerendered_directory: string
 *  FQDN?: AWSAdapterProps["FQDN"]
 *  defaultHeaders: Required<AWSAdapterProps>["defaultHeaders"]
 *  extraHeaders: AWSAdapterProps["extraHeaders"]
 *  serverArn: string
 *  optionsArn: string
 * }} deployMainStackArgs 
 * @returns {Promise<{
 *  mainAllowedOrigins: string
 *  mainPath: string
 * }>}
 */
async function deployMainStack({
  stackName,
  region,
  edge_directory,
  static_directory,
  prerendered_directory,
  FQDN,
  defaultHeaders,
  extraHeaders,
  serverArn,
  optionsArn,
}: {
    stackName: Required<AWSAdapterProps>["stackName"];
    region: Required<AWSAdapterProps>["region"];
    edge_directory: string;
    static_directory: string;
    prerendered_directory: string;
    FQDN?: AWSAdapterProps["FQDN"];
    defaultHeaders: Required<AWSAdapterProps>["defaultHeaders"];
    extraHeaders: AWSAdapterProps["extraHeaders"];
    serverArn: string;
    optionsArn: string;
  }): Promise<{
  mainAllowedOrigins: string;
  mainPath: string;
}> {
  const mainPath = join(__dirname, 'stacks', 'main')
  /** @type {import('@pulumi/pulumi/automation/index.js').LocalProgramArgs} */
  const mainArgs: import('@pulumi/pulumi/automation/index.js').LocalProgramArgs = {
    stackName: stackName,
    workDir: mainPath,
  }
  const mainStack = await LocalWorkspace.createOrSelectStack(
    mainArgs,
    {
      envVars: {
        TS_NODE_IGNORE: '^(?!.*(@freedev/sveltekit-adapter)).*',
        TS_NODE_TYPE_CHECK: '0',
        PULUMI_NODEJS_TRANSPILE_ONLY: 'true',
      }
    })

  // Set the AWS region.
  await mainStack.setConfig("aws:region", { value: region });

  await mainStack.setAllConfig({
    edgePath: { value: edge_directory },
    staticPath: { value: static_directory },
    prerenderedPath: { value: prerendered_directory },
    serverArn: { value: serverArn },
    optionsArn: { value: optionsArn },
  });

  if (FQDN) {
    await mainStack.setConfig('FQDN', { value: FQDN });
  }

  /** @type {string[]} */
  let serverHeaders: string[] = [...defaultHeaders];

  if (extraHeaders) {
    serverHeaders = serverHeaders.concat(extraHeaders)
  }

  if (serverHeaders.length > 0) {
    await mainStack.setConfig('serverHeaders', {
      value: JSON.stringify(serverHeaders),
    })
  }

  await mainStack.refresh();
  const mainStackUpResult = await mainStack.up({ onOutput: console.info });
  const mainAllowedOrigins = JSON.stringify(
    mainStackUpResult.outputs.allowedOrigins.value
  );

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
}: {
    serverStack: import('@pulumi/pulumi/automation/index.js').Stack;
    mainAllowedOrigins: string;
  }) {
  let serverAllowedOrigins = '';
  const serverConfig = await serverStack.getAllConfig()
  
  if ('sveltekit-aws-adapter-server:allowedOrigins' in serverConfig) {
    serverAllowedOrigins =
      serverConfig['sveltekit-aws-adapter-server:allowedOrigins'].value
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