import * as pulumi from '@pulumi/pulumi'
import { getLambdaRole, buildLambda } from './resources'
import { getEnvironment } from '../utils'

/**
 * @typedef {Object} EnvironmentVariables
 * @property {string} ALLOWED_ORIGINS - The allowed origins for CORS.
 */

const pulumiConfig = new pulumi.Config()

const projectPath = pulumiConfig.get('projectPath')
const serverPath = pulumiConfig.get('serverPath')
const optionsPath = pulumiConfig.get('optionsPath')
const memorySizeStr = pulumiConfig.get('memorySize')
const allowedOriginsStr = pulumiConfig.get('allowedOrigins')

/** @type {number} */
let memorySize = 128

if (memorySizeStr) {
  memorySize = Number(memorySizeStr)
}

/** @type {EnvironmentVariables} */
let optionsEnv = {}

if (allowedOriginsStr) {
  optionsEnv['ALLOWED_ORIGINS'] = allowedOriginsStr
}

const iamForLambda = getLambdaRole()
const environment = getEnvironment(projectPath)

const serverURL = buildLambda(
  'LambdaServer',
  iamForLambda,
  serverPath,
  environment.parsed,
  memorySize
)

const optionsURL = buildLambda(
  'LambdaOptions',
  iamForLambda,
  optionsPath,
  optionsEnv
)

/**
 * The domain of the server Lambda function.
 * @type {pulumi.Output<string>}
 */
export const serverDomain = serverURL.functionUrl.apply((endpoint) =>
  endpoint.split('://')[1].slice(0, -1)
)

/**
 * The domain of the options Lambda function.
 * @type {pulumi.Output<string>}
 */
export const optionsDomain = optionsURL.functionUrl.apply((endpoint) =>
  endpoint.split('://')[1].slice(0, -1)
)
