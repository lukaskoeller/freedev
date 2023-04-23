import * as pulumi from '@pulumi/pulumi'
import { getLambdaRole, buildLambda } from './resources'
import { getEnvironment } from '../utils'

/**
 * @typedef {Object} EnvironmentVariables
 * @property {string} ALLOWED_ORIGINS - The allowed origins for CORS.
 */

const pulumiConfig = new pulumi.Config()

/** @type {string!} */
const projectPath = pulumiConfig.get('projectPath')
const serverPath = pulumiConfig.get('serverPath')
const optionsPath = pulumiConfig.get('optionsPath')
const memorySizeStr = pulumiConfig.get('memorySize')
const allowedOriginsStr = pulumiConfig.get('allowedOrigins')

/** @type {number} */
let memorySize: number = 128

if (memorySizeStr) {
  memorySize = Number(memorySizeStr)
}

/** @type {EnvironmentVariables} */
let optionsEnv: any = {};

if (allowedOriginsStr) {
  optionsEnv['ALLOWED_ORIGINS'] = allowedOriginsStr
}

const iamForLambda = getLambdaRole()
const environment = getEnvironment(projectPath!)

const serverURL = buildLambda(
  'LambdaServer',
  iamForLambda,
  serverPath!,
  environment.parsed,
  memorySize
);

const optionsURL = buildLambda(
  'LambdaOptions',
  iamForLambda,
  optionsPath!,
  optionsEnv
);

/**
 * The ARN of the server Lambda function.
 * @type {pulumi.Output<string>}
 */
export const serverArn = serverURL.functionArn;

/**
 * The domain of the server Lambda function.
 * @type {pulumi.Output<string>}
 */
export const serverDomain = serverURL.functionUrl.apply((endpoint) =>
  endpoint.split('://')[1].slice(0, -1)
)

/**
 * The ARN of the options Lambda function.
 * @type {pulumi.Output<string>}
 */
export const optionsArn = optionsURL.functionArn;

/**
 * The domain of the options Lambda function.
 * @type {pulumi.Output<string>}
 */
export const optionsDomain = optionsURL.functionUrl.apply((endpoint) =>
  endpoint.split('://')[1].slice(0, -1)
)
