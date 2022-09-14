import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";

export enum APIStage {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  // @todo to be continued
}

export type MicroserviceParams = {
  /**
   * Name of the route.
   */
  name: string;
  /**
   * Path of the route.
   * Must start with a forward slash (/).
   * @example `/user`
   */
  path: string;
  /**
   * Is required except that path is "$default"
   */
  httpMethod?: HttpMethod;
  api: aws.apigatewayv2.Api;
}

class Microservice {
  /**
   * Lambda IAM Role
   * @description Creates the IAM Role for the Lambda Function.
   */
  lambdaIamRole: aws.iam.Role;
  /**
   * Lambda Role Attachment
   * @description Attaches an IAM Role to the Lambda Function. This allows the Lambda to log to CloudWatch.
   */
  lambdaRoleAttachment: aws.iam.RolePolicyAttachment;
  /**
   * Lambda
   * @description Creates the Lambda function
   */
  lambda: aws.lambda.Function;
  /**
   * API Gateway v2
   * @description: Creates the HTTP API using the APIGateway v2
   */
  apigatewayv2: aws.apigatewayv2.Api;
  /**
   * Lambda Permission
   * @description Gives apigatewayv2 permission to access the Lambda function.
   */
  lambdaPermission: aws.lambda.Permission;
  /**
   * API Gateway v2 Integration
   * @description Integrates the Lambda Function with the APIGateway
   */
  apigatewayv2Integration: aws.apigatewayv2.Integration;
  /**
   * API Gateway v2 Route
   * @description Route to be added to the API
   */
  apigatewayv2Route: aws.apigatewayv2.Route;
  /**
   * API Gateway v2 Stage
   * Stage of route of the API
   * @see {APIStage}
   */
  // apigatewayv2Stage: aws.apigatewayv2.Stage;
  /**
   * Returns the API URL when deploying via pulumi.
   */
  // endpoint: pulumi.Output<string>;

  /**
   * Initiates a microservice creating a lambda, an api route and an integration for both.
   * @param {MicroserviceParams} parameters
   */
  constructor(parameters: MicroserviceParams) {
    this.lambdaIamRole = new aws.iam.Role(`${parameters.name}-lambda-iam-role`, {
      assumeRolePolicy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
          }
        ]
      }`,
    });

    this.lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(`${parameters.name}-lambda-role-attachment`, {
      role: this.lambdaIamRole,
      policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    });

    this.lambda = new aws.lambda.Function(parameters.name, {
      code: new pulumi.asset.AssetArchive({
        '.': new pulumi.asset.FileArchive(`../functions/build/${parameters.name}`),
      }),
      role: this.lambdaIamRole.arn,
      handler: "index.handler",
      runtime: "nodejs16.x",
      // environment: {
      //     variables: {
      //         foo: "bar",
      //     },
      // },
    });

    this.apigatewayv2 = parameters.api;

    this.lambdaPermission = new aws.lambda.Permission(`${parameters.name}-lambda-permission`, {
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      function: this.lambda,
      sourceArn: pulumi.interpolate`${this.apigatewayv2.executionArn}/*/*`,
    }, {dependsOn: [this.apigatewayv2, this.lambda]});

    this.apigatewayv2Integration = new aws.apigatewayv2.Integration(`${parameters.name}-lambda-integration`, {
      apiId: this.apigatewayv2.id,
      integrationType: "AWS_PROXY",
      integrationUri: this.lambda.arn,
      integrationMethod: "POST",
      payloadFormatVersion: "2.0",
      passthroughBehavior: "WHEN_NO_MATCH",
    });

    this.apigatewayv2Route = new aws.apigatewayv2.Route(`${parameters.name}-api-route`, {
      apiId: this.apigatewayv2.id,
      routeKey: `${parameters?.httpMethod ? `${parameters?.httpMethod} ` : ''}${parameters.path}`,
      target: pulumi.interpolate`integrations/${this.apigatewayv2Integration.id}`,
    });
  }
}

const emailConfiguration = new aws.ses.ConfigurationSet("email-sign-up-verification", {
  deliveryOptions: {
      tlsPolicy: "Require",
  },
  sendingEnabled: true,
  // trackingOptions @todo enable or not?
});

export const emailConfigurationArn = emailConfiguration.arn;

const emailIdentity = new aws.ses.EmailIdentity("hey-freedev-email-identity", {
  email: "hey@freedev.app",
});

const userPool = new aws.cognito.UserPool('appPool', {
  accountRecoverySetting: {
    recoveryMechanisms: [
        {
            name: "verified_email",
            priority: 1,
        },
        {
            name: "verified_phone_number",
            priority: 2,
        },
    ],
  },
  usernameAttributes: ['phone_number', 'email'],
  emailConfiguration: {
    configurationSet: emailConfiguration.name,
    emailSendingAccount: 'DEVELOPER',
    fromEmailAddress: 'freedev <hey@freedev.app>',
    replyToEmailAddress: 'hey@freedev.app',
    sourceArn: emailIdentity.arn,
  },
  verificationMessageTemplate: {
    defaultEmailOption: 'CONFIRM_WITH_CODE',
    emailMessage: 'freedev says hello! Use {####} to confirm your sign up.',
    emailSubject: 'Verify your account with freedev',
  },
  deviceConfiguration: {
    deviceOnlyRememberedOnUserPrompt: true,
  },
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireSymbols: true,
    requireNumbers: true,
    requireUppercase: true,
  }
});

const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {
  userPoolId: userPool.id,
});

const api = new aws.apigatewayv2.Api("httpApiGateway", {
  protocolType: "HTTP",
});

const apiStage = new aws.apigatewayv2.Stage(`${pulumi.getStack()}-api-stage`, {
  apiId: api.id,
  // @see https://stackoverflow.com/questions/61027859/conflictexception-stage-already-exist-from-aws-api-gateway-deployment-with-stag
  name: pulumi.getStack(), // @todo rework?
  autoDeploy: true,
  // deploymentId: `${pulumi.getStack()}-api-deployment-id`,
  // @todo integrate into microservice!?
  // routeSettings: [
  //   {
  //     routeKey: this.apigatewayv2Route.routeKey,
  //     throttlingBurstLimit: 5000,
  //     throttlingRateLimit: 10000,
  //   },
  // ],
  // autoDeploy: true,
});

export const endpoint = pulumi.interpolate`${api.apiEndpoint}/${apiStage.name}`;

/**
 * @todo Iterate through openapi.json and create new Microservice.
 */
const signup = new Microservice({
  name: 'sign-up',
  path: '/sign-up',
  httpMethod: HttpMethod.PUT,
  api,
});

/**
 * Root of website (homepage). Path is '/' or 'https://freedev.app'.
 */
const root = new Microservice({
  name: 'default',
  path: '$default',
  api,
});

// const apiDeployment = new aws.apigatewayv2.Deployment("freedev-api-deployment", {
//   apiId: api.id,
//   description: "freedev api deployment",
// }, {
//   dependsOn: [
//     signup.apigatewayv2Route,
//     root.apigatewayv2Route,
//   ]
// });

/**
 * AWS S3
 * Static Website Hosting
 */
// Load the Pulumi program configuration. These act as the "parameters" to the Pulumi program,
// so that different Pulumi Stacks can be brought up using the same code.

const stackConfig = new pulumi.Config("web");

const config = {
    // pathToWebsiteContents is a relativepath to the website's contents.
    pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
    // targetDomain is the domain/host to serve content at.
    targetDomain: stackConfig.require("targetDomain"),
    // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.
    certificateArn: stackConfig.get("certificateArn"),
    // If true create an A record for the www subdomain of targetDomain pointing to the generated cloudfront distribution.
    // If a certificate was generated it will support this subdomain.
    // default: true
    includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
};

// contentBucket is the S3 bucket that the website's contents will be stored in.
const contentBucket = new aws.s3.Bucket("contentBucket",
    {
        bucket: config.targetDomain,
        // Configure S3 to serve bucket contents as a website. This way S3 will automatically convert
        // requests for "foo/" to "foo/index.html".
        website: {
            indexDocument: "index.html",
            errorDocument: "404.html",
        },
    });

// crawlDirectory recursive crawls the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
function crawlDirectory(dir: string, f: (_: string) => void) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = `${dir}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            crawlDirectory(filePath, f);
        }
        if (stat.isFile()) {
            f(filePath);
        }
    }
}

// Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
const webContentsRootPath = path.join(process.cwd(), config.pathToWebsiteContents);
const webContentsPrerenderedPath = path.join(process.cwd(), `${config.pathToWebsiteContents}/prerendered`);
const webContentsAssetsPath = path.join(process.cwd(), `${config.pathToWebsiteContents}/assets`);
console.log("Syncing contents from local disk at", webContentsRootPath);
// crawlDirectory(
//     webContentsRootPath,
//     (filePath: string) => {
//         const relativeFilePath = filePath.replace(webContentsRootPath + "/", "");
//         const contentFile = new aws.s3.BucketObject(
//             relativeFilePath,
//             {
//                 key: relativeFilePath,

//                 acl: "public-read",
//                 bucket: contentBucket,
//                 contentType: mime.getType(filePath) || undefined,
//                 source: new pulumi.asset.FileAsset(filePath),
//             },
//             {
//                 parent: contentBucket,
//             });
//     });

/**
 * @todo Simplify function calling (DRY)
 */

crawlDirectory(
  webContentsPrerenderedPath,
  (filePath: string) => {
      const relativeFilePath = filePath.replace(webContentsPrerenderedPath + "/", "");
      const contentFile = new aws.s3.BucketObject(
          relativeFilePath,
          {
              key: relativeFilePath,

              acl: "public-read",
              bucket: contentBucket,
              contentType: mime.getType(filePath) || undefined,
              source: new pulumi.asset.FileAsset(filePath),
          },
          {
              parent: contentBucket,
          });
  });

  crawlDirectory(
    webContentsAssetsPath,
    (filePath: string) => {
        const relativeFilePath = filePath.replace(webContentsAssetsPath + "/", "");
        const contentFile = new aws.s3.BucketObject(
            relativeFilePath,
            {
                key: relativeFilePath,

                acl: "public-read",
                bucket: contentBucket,
                contentType: mime.getType(filePath) || undefined,
                source: new pulumi.asset.FileAsset(filePath),
            },
            {
                parent: contentBucket,
            });
    });

// logsBucket is an S3 bucket that will contain the CDN's request logs.
const logsBucket = new aws.s3.Bucket("requestLogs",
    {
        bucket: `${config.targetDomain}-logs`,
        acl: "private",
    });

const tenMinutes = 60 * 10;

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

const eastRegion = new aws.Provider("east", {
  profile: aws.config.profile,
  region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region. Same for Lambda@edge
});

/**
 * Only provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
 */
if (config.certificateArn === undefined) {

    const eastRegion = new aws.Provider("east", {
        profile: aws.config.profile,
        region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
    });

    // if config.includeWWW include required subjectAlternativeNames to support the www subdomain
    const certificateConfig: aws.acm.CertificateArgs = {
        domainName: config.targetDomain,
        validationMethod: "DNS",
        subjectAlternativeNames: config.includeWWW ? [`www.${config.targetDomain}`] : [],
    };

    const certificate = new aws.acm.Certificate("certificate", certificateConfig, { provider: eastRegion });

    // const domainParts = getDomainAndSubdomain(targetDomain);
    // const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

    /**
     *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
     *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
     */
    const certificateValidationDomain = new aws.route53.Record(`${config.targetDomain}-validation`, {
        name: certificate.domainValidationOptions[0].resourceRecordName,
        zoneId: hostedZoneId,
        type: certificate.domainValidationOptions[0].resourceRecordType,
        records: [certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: tenMinutes,
    });

    // if config.includeWWW ensure we validate the www subdomain as well
    let subdomainCertificateValidationDomain;
    if (config.includeWWW) {
        subdomainCertificateValidationDomain = new aws.route53.Record(`${config.targetDomain}-validation2`, {
            name: certificate.domainValidationOptions[1].resourceRecordName,
            zoneId: hostedZoneId,
            type: certificate.domainValidationOptions[1].resourceRecordType,
            records: [certificate.domainValidationOptions[1].resourceRecordValue],
            ttl: tenMinutes,
        });
    }

    // if config.includeWWW include the validation record for the www subdomain
    const validationRecordFqdns = subdomainCertificateValidationDomain === undefined ?
        [certificateValidationDomain.fqdn] : [certificateValidationDomain.fqdn, subdomainCertificateValidationDomain.fqdn];

    /**
     * This is a _special_ resource that waits for ACM to complete validation via the DNS record
     * checking for a status of "ISSUED" on the certificate itself. No actual resources are
     * created (or updated or deleted).
     *
     * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
     * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
     * for the actual implementation.
     */
    const certificateValidation = new aws.acm.CertificateValidation("certificateValidation", {
        certificateArn: certificate.arn,
        validationRecordFqdns: validationRecordFqdns,
    }, { provider: eastRegion });

    certificateArn = certificateValidation.certificateArn;
}

// Generate Origin Access Identity to access the private s3 bucket.
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("originAccessIdentity", {
  comment: "this is needed to setup s3 polices and make s3 not public.",
});

// if config.includeWWW include an alias for the www subdomain
const distributionAliases = config.includeWWW ? [config.targetDomain, `www.${config.targetDomain}`] : [config.targetDomain];

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
        {
            originId: contentBucket.arn,
            domainName: contentBucket.bucketDomainName,
            s3OriginConfig: {
                originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
            },
        },
    ],

    defaultRootObject: "index.html",

    // A CloudFront distribution can configure different cache behaviors based on the request path.
    // Here we just specify a single, default cache behavior which is just read-only requests to S3.
    defaultCacheBehavior: {
        targetOriginId: contentBucket.arn,

        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD", "OPTIONS"],

        forwardedValues: {
            cookies: { forward: "none" },
            queryString: false,
        },

        minTtl: 0,
        defaultTtl: tenMinutes,
        maxTtl: tenMinutes,
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

const cdn = new aws.cloudfront.Distribution("cdn", distributionArgs, { dependsOn: contentBucket });

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
function getDomainAndSubdomain(domain: string): { subdomain: string, parentDomain: string } {
    const parts = domain.split(".");
    if (parts.length < 2) {
        throw new Error(`No TLD found on ${domain}`);
    }
    // No subdomain, e.g. awesome-website.com.
    if (parts.length === 2) {
        return { subdomain: "", parentDomain: domain };
    }

    const subdomain = parts[0];
    parts.shift();  // Drop first element.
    return {
        subdomain,
        // Trailing "." to canonicalize domain.
        parentDomain: parts.join(".") + ".",
    };
}

// Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
function createAliasRecord(
    targetDomain: string, distribution: aws.cloudfront.Distribution): aws.route53.Record {
    // const domainParts = getDomainAndSubdomain(targetDomain);
    // const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);
    return new aws.route53.Record(
        targetDomain,
        {
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

function createWWWAliasRecord(targetDomain: string, distribution: aws.cloudfront.Distribution): aws.route53.Record {
    // const domainParts = getDomainAndSubdomain(targetDomain);
    // const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

    return new aws.route53.Record(
        `${targetDomain}-www-alias`,
        {
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
        },
    );
}

const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: contentBucket.id, // refer to the bucket created earlier
    policy: pulumi.all([originAccessIdentity.iamArn, contentBucket.arn]).apply(([oaiArn, bucketArn]) =>JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
            Effect: "Allow",
            Principal: {
                AWS: oaiArn,
            }, // Only allow Cloudfront read access.
            Action: ["s3:GetObject"],
            Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
            },
        ],
    })),
});

const aRecord = createAliasRecord(config.targetDomain, cdn);
if (config.includeWWW) {
    const cnameRecord = createWWWAliasRecord(config.targetDomain, cdn);
}

// Export properties from this stack. This prints them at the end of `pulumi up` and
// makes them easier to access from the pulumi.com.
export const contentBucketUri = pulumi.interpolate`s3://${contentBucket.bucket}`;
export const contentBucketWebsiteEndpoint = contentBucket.websiteEndpoint;
export const cloudFrontDomain = cdn.domainName;
export const targetDomainEndpoint = `https://${config.targetDomain}/`;
