import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

import {
  getLambdaRole,
  buildRouter,
  buildStatic,
  buildCDN,
  createAliasRecord,
  buildInvalidator,
  SSLCertificate,
  SSLCertificateValidation,
  createHostedZone,
  createWWWAliasRecord,
} from './resources';

// Equals 60sec * 10 = 600sec | 10min
const tenMinutes = 600;

/**
 * US East Region Provider
 */
export const eastRegion = new aws.Provider("ProviderEast", {
  profile: aws.config.profile,
  region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region. Same for Lambda@edge
});

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


const [_, zoneName, ...MLDs] = FQDN.split('.');
const domainName = [zoneName, ...MLDs].join('.');

const hostedZone = createHostedZone({ FQDN, domainName });
const hostedZoneId = hostedZone.id;

const { certificate } = new SSLCertificate('Certificate', {
  targetDomain: domainName,
  includeWWW: true, // @todo add to config? Get rid if FQDN is used?
  region: eastRegion,
});

const {
  certificateValidation,
} = new SSLCertificateValidation('CertificateValidation', {
  certificate,
  hostedZoneId,
  ttl: tenMinutes,
  includeWWW: true,  // @todo add to config? Get rid if FQDN is used?
  region: eastRegion,
});

certificateArn = certificateValidation.certificateArn;

const bucket = buildStatic(staticPath, prerenderedPath);
const distribution = buildCDN({
  routerFunction: routerHandler,
  bucket,
  serverHeaders,
  FQDN,
  domainName,
  certificateArn,
  includeWWW: true, // @todo add to config? Get rid if FQDN is used?
}); // @todo include options { dependsOn: contentBucket } ?

createAliasRecord(domainName, distribution);
const includeWWW = true; // @todo add to config? Get rid if FQDN is used?
if (includeWWW) {
  const cnameRecord = createWWWAliasRecord(domainName, distribution);
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
