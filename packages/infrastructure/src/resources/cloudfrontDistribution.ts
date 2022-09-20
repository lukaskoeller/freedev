import * as aws from "@pulumi/aws";
import { Input } from "@pulumi/pulumi";
import { LambdaFunction } from "../common/models/function";

export type GetCloudfrontDistributionArgs = {
  aliases: Input<Input<string>[]> | undefined,
  ssrLambda: LambdaFunction,
  ssrLambdaUrl: aws.lambda.FunctionUrl,
  edgeLambda: LambdaFunction,
  contentBucket: aws.s3.Bucket,
  logsBucket: aws.s3.Bucket,
  ttl: number,
  acmCertificateArn: Input<string> | undefined,
  targetDomain: string,
  subdomain: string,
  hostedZoneId: Input<string>,
  includeWWW: boolean,
};

export const getCloudfrontDistribution = (args: GetCloudfrontDistributionArgs) => {
  const {
    aliases,
    ssrLambda,
    ssrLambdaUrl,
    edgeLambda,
    contentBucket,
    logsBucket,
    ttl,
    acmCertificateArn,
    targetDomain,
    subdomain,
    hostedZoneId,
    includeWWW,
  } = args;

  // distributionArgs configures the CloudFront distribution. Relevant documentation:
  // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
  // https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
  const distributionArgs: aws.cloudfront.DistributionArgs = {
    enabled: true,
    // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
    // Required if you want to access the distribution via config.targetDomain as well.
    aliases,

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
          domainName: ssrLambdaUrl.functionUrl.apply((url) => url.replace('https://', '').replace('/', '')),
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
      defaultTtl: ttl,
      maxTtl: ttl,

      lambdaFunctionAssociations: [{
        eventType: 'origin-request',
        lambdaArn: edgeLambda.arn,
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
        acmCertificateArn,  // Per AWS, ACM certificate must be in the us-east-1 region.
        sslSupportMethod: "sni-only",
    },

    loggingConfig: {
        bucket: logsBucket.bucketDomainName,
        includeCookies: false,
        prefix: `${targetDomain}/`,
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
    name: subdomain,
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

  const aRecord = createAliasRecord(targetDomain, cdn);
  if (includeWWW) {
  const cnameRecord = createWWWAliasRecord(targetDomain, cdn);
  }
}
