import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { createApi } from './src/functions';
import { createDatabase, createUserPoolAndClient } from './src/resources';
import { config, websiteS3 } from './src/resources/website'; // @todo temporary
import { LambdaFunction, SSLCertificate, SSLCertificateValidation } from "./src/common/models";
import { getDomainAndSubdomain } from "./src/common/utils";

/**
 * Cognito User Pool
 * Includes email configuration
 */
export const { userPoolEndpoint, userPoolClientId, clientSecret } =  createUserPoolAndClient();

/**
 * API Gateway v2
 */
createApi({ userPoolClientId, userPoolEndpoint });

/**
 * DynamDB Database
 */
const database = createDatabase();
export const databaseArn = database.arn;
export const databaseName = database.name;

/**
 * US East Region Provider
 */
const eastRegion = new aws.Provider("east", {
  profile: aws.config.profile,
  region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region. Same for Lambda@edge
});

// Equals 60sec * 10 = 600sec | 10min
const tenMinutes = 600;

// Will be overwritten later if config.certificateArn is `undefined`.
let certificateArn: pulumi.Input<string> = config.certificateArn!;

const domainParts = getDomainAndSubdomain(config.targetDomain);
console.log('domainParts.parentDomain', domainParts.parentDomain);

/**
 * A hosted zone is a container for records. Each record in a hosted zone contains information
 * about how you want to route traffic for a domain, such as freedev.app.
 * 
 * The information provided are used in the name server of the domain provider (here google domains).
 */
const hostedZone = new aws.route53.Zone(`${domainParts.parentDomain}HostedZone`, {
  name: domainParts.parentDomain
});

const hostedZoneId = hostedZone.id;

/**
 * Only provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
 */
// @todo Enable DNSSEC (see Route53)
if (config.certificateArn === undefined) {

    const { certificate } = new SSLCertificate('web', {
      targetDomain: config.targetDomain,
      includeWWW: config.includeWWW,
      region: eastRegion,
    });

    const {
      certificateValidation,
    } = new SSLCertificateValidation('web', {
      certificate,
      hostedZoneId,
      ttl: tenMinutes,
      includeWWW: config.includeWWW,
      region: eastRegion,
    });

    certificateArn = certificateValidation.certificateArn;
}

// Generate Origin Access Identity to access the private s3 bucket.
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("originAccessIdentity", {
  comment: "this is needed to setup s3 polices and make s3 not public.",
});

/**
 * AWS S3
 * Static Website Hosting
 */
 const {
  contentBucket,
  logsBucket,
} = websiteS3(originAccessIdentity);

// if config.includeWWW include an alias for the www subdomain
const distributionAliases = config.includeWWW ? [config.targetDomain, `www.${config.targetDomain}`] : [config.targetDomain];

/**
 * Creating Lambda@Edge that is associated with
 * the following cloudfront distribution
 */
const edgeRouterLambda = new LambdaFunction('edge-router', {
  region: eastRegion,
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
          Action: "sts:AssumeRole",
          Principal: aws.iam.Principals.LambdaPrincipal,
          Effect: "Allow",
      },
      {
          Action: "sts:AssumeRole",
          Principal: aws.iam.Principals.EdgeLambdaPrincipal,
          Effect: "Allow",
      },
    ],
  },
  policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive(`../../apps/web/build/edge`),
  }),
  handler: "router.handler",
  publish: true,
});

/**
 * Creating Lambda Function for SSR of the
 * sveltekit app. It acts as the default origin
 * for the cloudfront distribution and returns
 * requested html template on request.
 * 
 * Invocation happens through http request via a direct url.
 */
const ssrLambdaName =  'ssr-app'
const ssrLambda = new LambdaFunction(ssrLambdaName, {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
          Action: "sts:AssumeRole",
          Principal: aws.iam.Principals.LambdaPrincipal,
          Effect: "Allow",
      },
    ],
  },
  policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive(`../../apps/web/build/server`),
  }),
  handler: "serverless.handler",
});

const ssrLambdaFunctionUrl = new aws.lambda.FunctionUrl(`${ssrLambdaName}-lambda-url`, {
  functionName: ssrLambda.arn,
  authorizationType: "NONE",
});

export const ssrLambdaUrl = ssrLambdaFunctionUrl.functionUrl;

// distributionArgs configures the CloudFront distribution. Relevant documentation:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
// https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
const distributionArgs: aws.cloudfront.DistributionArgs = {
    enabled: true,
    // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
    // Required if you want to access the distribution via config.targetDomain as well.
    aliases: distributionAliases,

    // We only specify one origin for this distribution, the S3 content bucket.
    origins: [
        /**
         * Only used if the only origin is S3, which is the case for static site hosting.
         */
        // {
        //     originId: contentBucket.arn,
        //     domainName: contentBucket.bucketDomainName,
        //     s3OriginConfig: {
        //         originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
        //     },
        //     /**
        //      * Workaround for environment variables
        //      * @see https://stackoverflow.com/questions/54828808/aws-lambdaedge-nodejs-environment-variables-are-not-supported
        //      */
        //     customHeaders: [{
        //       // referenced in web/build/edge/router.js
        //       name: 's3-host',
        //       value: contentBucket.bucketDomainName,
        //     }],
        // },
        {
          originId: ssrLambda.arn,
          domainName: ssrLambdaUrl.apply((url) => url.replace('https://', '').replace('/', '')),
          customOriginConfig: {
              httpPort: 80,
              httpsPort: 443,
              originProtocolPolicy: 'https-only',
              originSslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2'], // @todo can list be narrowed down?
          },
          /**
           * Workaround for environment variables
           * @see https://stackoverflow.com/questions/54828808/aws-lambdaedge-nodejs-environment-variables-are-not-supported
           */
          customHeaders: [{
            // referenced in web/build/edge/router.js
            name: 's3-host',
            value: contentBucket.bucketDomainName,
          }],
      },
    ],

    comment: contentBucket.bucketDomainName,

    // defaultRootObject: "index.html",

    // A CloudFront distribution can configure different cache behaviors based on the request path.
    // Here we just specify a single, default cache behavior which is just read-only requests to S3.
    /**
     * Only used if the only origin is S3, which is the case for static site hosting.
     */
    // defaultCacheBehavior: {
    //     targetOriginId: contentBucket.arn,

    //     viewerProtocolPolicy: "redirect-to-https",
    //     allowedMethods: ["GET", "HEAD", "OPTIONS"],
    //     cachedMethods: ["GET", "HEAD", "OPTIONS"],

    //     forwardedValues: {
    //         cookies: { forward: "none" },
    //         queryString: false,
    //     },

    //     minTtl: 0,
    //     defaultTtl: tenMinutes,
    //     maxTtl: tenMinutes,

    //     lambdaFunctionAssociations: [{
    //       eventType: 'origin-request',
    //       lambdaArn: edgeRouterLambdaArn,
    //     }],
    // },
    defaultCacheBehavior: {
      targetOriginId: ssrLambda.arn,

      viewerProtocolPolicy: "redirect-to-https",
      allowedMethods: ["GET", "HEAD", "OPTIONS", "DELETE", "PATCH", "POST", "PUT"],
      cachedMethods: ["GET", "HEAD", "OPTIONS"],

      forwardedValues: {
          cookies: { forward: "all" },
          queryString: true,
      },

      minTtl: 0,
      defaultTtl: tenMinutes,
      maxTtl: tenMinutes,

      lambdaFunctionAssociations: [{
        eventType: 'origin-request',
        lambdaArn: edgeRouterLambda.arnVersion,
      }],
  },

    // "All" is the most broad distribution, and also the most expensive.
    // "100" is the least broad, and also the least expensive.
    priceClass: "PriceClass_100",

    // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
    // web service) it can return a different error code, and return the response for a different resource.
    customErrorResponses: [
        { errorCode: 404, responseCode: 404, responsePagePath: "/404.html" },
    ],

    restrictions: {
        geoRestriction: {
            restrictionType: "none",
        },
    },

    viewerCertificate: {
        acmCertificateArn: certificateArn,  // Per AWS, ACM certificate must be in the us-east-1 region.
        sslSupportMethod: "sni-only",
    },

    loggingConfig: {
        bucket: logsBucket.bucketDomainName,
        includeCookies: false,
        prefix: `${config.targetDomain}/`,
    },
};

// Creates a cloudfront web distribution
const cdn = new aws.cloudfront.Distribution("cdn", distributionArgs, { dependsOn: contentBucket });

// Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
function createAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution
): aws.route53.Record {
  // const domainParts = getDomainAndSubdomain(targetDomain);
  // const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);
  return new aws.route53.Record(targetDomain, {
    name: domainParts.subdomain,
    zoneId: hostedZoneId,
    type: "A",
    aliases: [
        {
            name: distribution.domainName,
            zoneId: distribution.hostedZoneId,
            evaluateTargetHealth: true,
        },
    ],
  });
}

function createWWWAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution
): aws.route53.Record {
  // const domainParts = getDomainAndSubdomain(targetDomain);
  // const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

  return new aws.route53.Record(`${targetDomain}-www-alias`, {
    name: `www.${targetDomain}`,
    zoneId: hostedZoneId,
    type: "A",
    aliases: [
        {
            name: distribution.domainName,
            zoneId: distribution.hostedZoneId,
            evaluateTargetHealth: true,
        },
    ],
  });
}

const aRecord = createAliasRecord(config.targetDomain, cdn);
if (config.includeWWW) {
  const cnameRecord = createWWWAliasRecord(config.targetDomain, cdn);
}

// Export properties from this stack. This prints them at the end of `pulumi up` and
// makes them easier to access from the pulumi.com.
export const contentBucketUri = pulumi.interpolate`s3://${contentBucket.bucket}`;
export const contentBucketWebsiteEndpoint = contentBucket.websiteEndpoint;
export const contentBucketDomainName = contentBucket.bucketDomainName;
export const cloudFrontDomain = cdn.domainName;
export const targetDomainEndpoint = `https://${config.targetDomain}/`;
