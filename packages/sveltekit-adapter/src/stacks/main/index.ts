import * as pulumi from '@pulumi/pulumi'

import {
  getLambdaRole,
  buildRouter,
  validateCertificate,
  buildStatic,
  buildCDN,
  createAliasRecord,
  buildInvalidator,
} from './resources'

const pulumiConfig = new pulumi.Config();
const edgePath = pulumiConfig.get('edgePath') as string;
const staticPath = pulumiConfig.get('staticPath') as string;
const prerenderedPath = pulumiConfig.get('prerenderedPath') as string;
const FQDN = pulumiConfig.get('FQDN') as string;
const serverHeadersStr = pulumiConfig.get('serverHeaders');

/** @type {string[]} */
let serverHeaders = [];

if (serverHeadersStr) {
  serverHeaders = JSON.parse(serverHeadersStr)
}

const iamForLambda = getLambdaRole()
const routerHandler = buildRouter(iamForLambda, edgePath);

/** @type {pulumi.Input<string> | undefined} */
let certificateArn: pulumi.Input<string> | undefined;


if (FQDN) {
  const [_, zoneName, ...MLDs] = FQDN.split('.');
  const domainName = [zoneName, ...MLDs].join('.');
  certificateArn = validateCertificate(FQDN, domainName);
}

const bucket = buildStatic(staticPath, prerenderedPath);
const distribution = buildCDN(
  routerHandler,
  bucket,
  serverHeaders,
  FQDN,
  certificateArn,
)

if (FQDN) {
  createAliasRecord(FQDN, distribution)
}

/** @type {(string | pulumi.Output<string>)[]} */
var getOrigins: (string | pulumi.Output<string>)[] = [
  pulumi.interpolate`https://${distribution.domainName}`,
]
FQDN && getOrigins.push(`https://${FQDN}`)

buildInvalidator(distribution, staticPath, prerenderedPath);

export const allowedOrigins = getOrigins
export const appUrl = FQDN
  ? `https://${FQDN}`
  : pulumi.interpolate`https://${distribution.domainName}`
