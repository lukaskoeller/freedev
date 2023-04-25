import * as fs from 'fs'
import * as mime from 'mime'
import * as path from 'path'

import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { local } from '@pulumi/command'

import { NameRegister } from '../utils'

const nameRegister = NameRegister.getInstance()
/**
 * 
 * @param {string} name 
 * @returns {string}
 */
let registerName = (name: string): string => {
  return nameRegister.registerName(name)
}

/**
 * US East Region Provider
 */
const eastRegion = new aws.Provider("ProviderEast", {
  profile: aws.config.profile,
  region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region. Same for Lambda@edge
});

/** @returns {aws.iam.Role} */
export function getLambdaRole(): aws.iam.Role {
  const iamForLambda = new aws.iam.Role(registerName('IamForLambda'), {
    assumeRolePolicy: `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Principal": {
                "Service": [
                  "lambda.amazonaws.com",
                  "edgelambda.amazonaws.com"
                ]
              },
              "Effect": "Allow",
              "Sid": ""
            }
          ]
        }
        `,
  })

  const RPA = new aws.iam.RolePolicyAttachment(
    registerName('ServerRPABasicExecutionRole'),
    {
      role: iamForLambda.name,
      policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }
  )

  return iamForLambda
}

/**
 * 
 * @param {aws.iam.Role} iamForLambda 
 * @param {string} routerPath 
 * @returns {aws.lambda.Function}
 */
export function buildRouter(
  iamForLambda: aws.iam.Role,
  routerPath: string,
): aws.lambda.Function {
  const routerHandler = new aws.lambda.Function(
    registerName('LambdaRouterFunctionHandler'),
    {
      code: new pulumi.asset.FileArchive(routerPath),
      role: iamForLambda.arn,
      handler: 'router.handler',
      runtime: 'nodejs18.x',
      memorySize: 128,
      publish: true,
    },
    { provider: eastRegion }
  )

  return routerHandler
}

export interface SSLCertificateArgs {
  /**
   * The domain/host to serve content at.
   */
  targetDomain: string;
  /**
   * Indicates if "www" should be included in the domain.
   * Should be true if `targetDomain` does not include "www".
   */
  includeWWW: boolean;
  /**
   * The region the certicate should be registered.
   */
  region: aws.Provider;
}

export class SSLCertificate extends pulumi.ComponentResource {
  config: aws.acm.CertificateArgs;
  certificate: aws.acm.Certificate;
  
  constructor(name: string, args: SSLCertificateArgs, opts?: pulumi.ComponentResourceOptions) {
    super('freedev:index:SSLCertificate', registerName(name), {}, opts);

    // if args.includeWWW include required subjectAlternativeNames to support the www subdomain
    this.config = {
      domainName: args.targetDomain,
      validationMethod: "DNS",
      subjectAlternativeNames: args.includeWWW ? [`www.${args.targetDomain}`] : [],
    };

    this.certificate = new aws.acm.Certificate(`${name}-certificate`, this.config, {
      provider: args.region,
      parent: this,
    });

    // Register output properties for this component
    this.registerOutputs({
      certificate: this.certificate,
    });
  }
}

export interface SSLCertificateValidationArgs {
  /**
   * The ACM certificate resource to be validated.
   */
  certificate: aws.acm.Certificate
  /**
   * The ID of the Hosted Zone.
   */
  hostedZoneId: pulumi.Output<string>;
  /**
   * The TTL of the record.
   * Is given in number of seconds
   * 
   * E.g. a number of 600 equals 10 minutes (60 * 10).
   */
  ttl: number;
  /**
   * Indicates if "www" should be included in the domain.
   * Should be true if `targetDomain` does not include "www".
   */
   includeWWW: boolean;
  /**
   * The region the certicate should be registered.
   */
  region: aws.Provider;
}

export class SSLCertificateValidation extends pulumi.ComponentResource {
  validationDomain: aws.route53.Record;
  subdomainValidationDomain: aws.route53.Record | undefined;
  validationRecordFqdns: [pulumi.Output<string>] | [pulumi.Output<string>, pulumi.Output<string>];
  certificateValidation: aws.acm.CertificateValidation;
  
  constructor(name: string, args: SSLCertificateValidationArgs, opts?: pulumi.ComponentResourceOptions) {
    super("freedev:index:SSLCertificateValidation", name, {}, opts);

    /**
     * Create a DNS record to prove that we _own_ the domain we're
     * requesting a certificate for.
     * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html
     */
    this.validationDomain = new aws.route53.Record(`${name}-validation-domain`, {
      name: args.certificate.domainValidationOptions[0].resourceRecordName,
      zoneId: args.hostedZoneId,
      type: args.certificate.domainValidationOptions[0].resourceRecordType,
      records: [args.certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: args.ttl,
    }, { parent: this });

    this.subdomainValidationDomain = args.includeWWW
      ? new aws.route53.Record(`${name}-validation-domain-2`, {
        name: args.certificate.domainValidationOptions[1].resourceRecordName,
        zoneId: args.hostedZoneId,
        type: args.certificate.domainValidationOptions[1].resourceRecordType,
        records: [args.certificate.domainValidationOptions[1].resourceRecordValue],
        ttl: args.ttl,
      }, { parent: this }) : undefined;

    // if config.includeWWW include the validation record for the www subdomain
    this.validationRecordFqdns = this.subdomainValidationDomain === undefined
      ? [this.validationDomain.fqdn]
      : [this.validationDomain.fqdn, this.subdomainValidationDomain.fqdn];

    /**
     * This is a _special_ resource that waits for ACM to complete
     * validation via the DNS record checking for a status of "ISSUED" on
     * the certificate itself.
     * No actual resources are created (or updated or deleted).
     *
     * @see https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html
     * @see https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
     */
    this.certificateValidation = new aws.acm.CertificateValidation(`${name}-certificate-validation`, {
      certificateArn: args.certificate.arn,
      validationRecordFqdns: this.validationRecordFqdns,
    }, {
      provider: args.region,
      parent: this,
    });

    // Register output properties for this component
    this.registerOutputs({
      certificateValidation: this.certificateValidation,
    });
  }
}

export const createHostedZone = ({ FQDN }: { FQDN: string }) => {
  const hostedZone = new aws.route53.Zone(registerName('HostedZone'), {
    name: FQDN,
  });

  // const hostedZone = aws.route53.getZone({
  //   name: domainName,
  //   privateZone: false,
  // })

  return hostedZone;
};

/**
 * 
 * @param {string} staticPath 
 * @param {string} prerenderedPath 
 * @returns {aws.s3.Bucket}
 */
export function buildStatic(
  staticPath: string,
  prerenderedPath: string,
): aws.s3.Bucket {
  const bucket = new aws.s3.Bucket(registerName('StaticContentBucket'), {
    acl: 'private',
    forceDestroy: true,
  })
  exports.uploadStatic(staticPath, bucket)
  exports.uploadStatic(prerenderedPath, bucket)
  return bucket
}

/**
 * Sync the contents of the source directory with
 * the S3 bucket, which will in-turn show up on the CDN.
 * @param {string} dirPath 
 * @param {aws.s3.Bucket} bucket 
 */
export function uploadStatic(dirPath: string, bucket: aws.s3.Bucket) {
  /**
   * crawlDirectory recursive crawls the provided directory,
   * applying the provided function to every file it contains.
   * Doesn't handle cycles from symlinks.
   * 
   * @param {string} dir 
   * @param {(_: string) => void} f 
   */
  function crawlDirectory(dir: string, f: (_: string) => void) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        crawlDirectory(filePath, f)
      }
      if (stat.isFile()) {
        f(filePath)
      }
    }
  }

  console.log('Syncing contents from local disk at', dirPath)
  crawlDirectory(
    dirPath,
    /** @param {string} filePath */
    (filePath: string) => {
      const relativeFilePath = filePath.replace(dirPath + path.sep, '')
      const posixFilePath = relativeFilePath.split(path.sep).join(path.posix.sep)
      const contentFile = new aws.s3.BucketObject(
        registerName(posixFilePath),
        {
          key: posixFilePath,
          bucket: bucket.id,
          contentType: mime.getType(filePath) || undefined,
          source: new pulumi.asset.FileAsset(filePath),
        },
        {
          parent: bucket,
        }
      )
  })
}

/**
 * 
 * @param {aws.lambda.Function} routerFunction 
 * @param {aws.s3.Bucket} bucket 
 * @param {string[]} serverHeaders 
 * @param {string} [FQDN]
 * @param {pulumi.Input<string>} [certificateArn]
 * @returns {aws.cloudfront.Distribution}
 */
export function buildCDN(
  routerFunction: aws.lambda.Function,
  bucket: aws.s3.Bucket,
  serverHeaders: string[],
  FQDN?: string,
  certificateArn?: pulumi.Input<string>,
): aws.cloudfront.Distribution {
  const defaultRequestPolicy = new aws.cloudfront.OriginRequestPolicy(
    registerName('DefaultRequestPolicy'),
    {
      cookiesConfig: {
        cookieBehavior: 'all',
      },
      headersConfig: {
        headerBehavior: 'whitelist',
        headers: {
          items: serverHeaders,
        },
      },
      queryStringsConfig: {
        queryStringBehavior: 'all',
      },
    }
  )

  const oac = new aws.cloudfront.OriginAccessControl(
    registerName('CloudFrontOriginAccessControl'),
    {
      description: 'Default Origin Access Control',
      name: 'CloudFrontOriginAccessControl',
      originAccessControlOriginType: 's3',
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
    }
  )

  const optimizedCachePolicy = aws.cloudfront.getCachePolicyOutput({
    name: 'Managed-CachingOptimized',
  })

  // serverFunctionURL.functionUrl.apply(
  //   (endpoint) => endpoint.split('://')[1].slice(0, -1)

  const distribution = new aws.cloudfront.Distribution(
    registerName('CloudFrontDistribution'),
    {
      enabled: true,
      origins: [
        {
          originId: 'default',
          domainName: bucket.bucketRegionalDomainName,
          originAccessControlId: oac.id,
        },
      ],
      aliases: FQDN ? [FQDN] : undefined,
      priceClass: 'PriceClass_100',
      viewerCertificate: FQDN
        ? {
            // Per AWS, ACM certificate must be in the us-east-1 region.
            acmCertificateArn: certificateArn,
            sslSupportMethod: 'sni-only',
          }
        : {
            cloudfrontDefaultCertificate: true,
          },
      defaultCacheBehavior: {
        compress: true,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: [
          'DELETE',
          'GET',
          'HEAD',
          'OPTIONS',
          'PATCH',
          'POST',
          'PUT',
        ],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        lambdaFunctionAssociations: [
          {
            eventType: 'origin-request',
            lambdaArn: pulumi
              .all([routerFunction.arn, routerFunction.version])
              .apply(([arn, version]) => {
                return `${arn}:${version}`
              }),
          },
        ],
        originRequestPolicyId: defaultRequestPolicy.id,
        cachePolicyId: optimizedCachePolicy.apply((policy) => /** @type {string!} */ policy.id!),
        targetOriginId: 'default',
      },
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
    }
  )

  const cloudFrontPolicyDocument = aws.iam.getPolicyDocumentOutput({
    statements: [
      {
        principals: [
          {
            type: 'Service',
            identifiers: ['cloudfront.amazonaws.com'],
          },
        ],
        actions: ['s3:GetObject'],
        resources: [pulumi.interpolate`${bucket.arn}/\*`],
        conditions: [
          {
            test: 'StringEquals',
            variable: 'AWS:SourceArn',
            values: [distribution.arn],
          },
        ],
      },
      {
        principals: [
          {
            type: 'AWS',
            identifiers: ['*'],
          },
        ],
        actions: ['s3:*'],
        effect: 'Deny',
        resources: [pulumi.interpolate`${bucket.arn}/\*`, bucket.arn],
        conditions: [
          {
            test: 'Bool',
            variable: 'aws:SecureTransport',
            values: ['false'],
          },
        ],
      },
    ],
  })

  const cloudFrontBucketPolicy = new aws.s3.BucketPolicy(
    registerName('CloudFrontBucketPolicy'),
    {
      bucket: bucket.id,
      policy: cloudFrontPolicyDocument.apply((policy) => policy.json),
    }
  )

  return distribution
}

/**
 * Creates a new Route53 DNS record pointing
 * the domain to the CloudFront distribution.
 * @param {string} targetDomain 
 * @param {aws.cloudfront.Distribution} distribution 
 * @returns {aws.route53.Record}
 */
export function createAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution,
): aws.route53.Record {
  const domainParts = exports.getDomainAndSubdomain(targetDomain)
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then((zone) => zone.zoneId)
  return new aws.route53.Record(registerName(targetDomain), {
    name: domainParts.subdomain,
    zoneId: hostedZoneId,
    type: 'A',
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  })
}

// 
// 
/**
 * Split a domain name into its subdomain and parent domain names.
 * @example ```js
 *  getDomainAndSubdomain("www.example.com")
 *  // { subdomain: "www", parentDomain: "example.com" }
 * ```
 * @param {string} domain 
 * @returns {{
 *  subdomain: string
 *  parentDomain: string
 * }}
 */
export function getDomainAndSubdomain(domain: string): {
  subdomain: string
  parentDomain: string
} {
  const parts = domain.split('.')
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`)
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: '', parentDomain: domain }
  }
  const subdomain = parts[0]
  parts.shift() // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: parts.join('.') + '.',
  }
}

/**
 * 
 * @param {aws.cloudfront.Distribution} distribution 
 * @param {string} staticPath 
 * @param {string} prerenderedPath 
 */
export function buildInvalidator(
  distribution: aws.cloudfront.Distribution,
  staticPath: string,
  prerenderedPath: string,
) {
  interface PathHashResourceInputs {
    path: pulumi.Input<string>
  }

  interface PathHashInputs {
    path: string
  }

  interface PathHashOutputs {
    hash: string
  }

  /**
   * @typedef {{
   *  path: pulumi.Input<string>
   * }} PathHashResourceInputs
   * 
   * @typedef {{
   *  path: string
   * }} PathHashInputs
   * 
   * @typedef {{
   *  hash: string
   * }} PathHashOutputs
   */

  /** @type {pulumi.dynamic.ResourceProvider} */
  const pathHashProvider: pulumi.dynamic.ResourceProvider = {
    /**
     * @param {PathHashInputs} inputs 
     * @returns {{
     *  id: PathHashInputs["path"],
     *  outs: { hash: string }
     * }}
     */
    async create(inputs: PathHashInputs) {
      const folderHash = await import('folder-hash')
      const pathHash = await folderHash.hashElement(inputs.path)
      return { id: inputs.path, outs: { hash: pathHash.toString() } }
    },
    /**
     * 
     * @param {string} id 
     * @param {PathHashOutputs} previousOutput 
     * @param {PathHashInputs} news 
     * @returns {Promise<pulumi.dynamic.DiffResult>}
     */
    async diff(
      id: string,
      previousOutput: PathHashOutputs,
      news: PathHashInputs,
    ): Promise<pulumi.dynamic.DiffResult> {
      /** @type {string[]} */
      const replaces: string[] = []
      let changes = true

      const oldHash = previousOutput.hash
      const folderHash = await import('folder-hash')
      const newHash = await folderHash.hashElement(news.path)

      if (oldHash === newHash.toString()) {
        changes = false
      }

      return {
        deleteBeforeReplace: false,
        replaces: replaces,
        changes: changes,
      }
    },
    /**
     * 
     * @param {*} id 
     * @param {PathHashInputs} olds 
     * @param {PathHashInputs} news 
     * @returns 
     */
    async update(id: any, olds: PathHashInputs, news: PathHashInputs) {
      const folderHash = await import('folder-hash')
      const pathHash = await folderHash.hashElement(news.path)
      return { outs: { hash: pathHash.toString() } }
    },
  }

  /**
   * @class PathHash
   * @extends pulumi.dynamic.Resource
   * @property {pulumi.Output<string>} hash - The hashed output.
   */
  class PathHash extends pulumi.dynamic.Resource {
    public readonly hash!: pulumi.Output<string>
    /**
     * @param {string} name - The name of the resource.
     * @param {PathHashResourceInputs} args - The arguments to configure the resource.
     * @param {pulumi.CustomResourceOptions} [opts] - Additional resource options.
     */
    constructor(
      name: string,
      args: PathHashResourceInputs,
      opts?: pulumi.CustomResourceOptions,
    ) {
      super(pathHashProvider, name, { hash: undefined, ...args }, opts)
    }
  }

  let staticHash = new PathHash(registerName('StaticHash'), {
    path: staticPath,
  })

  let prerenderedHash = new PathHash(registerName('PrerenderedHash'), {
    path: prerenderedPath,
  })

  const invalidationCommand = new local.Command(
    registerName('Invalidate'),
    {
      create: pulumi.interpolate`aws cloudfront create-invalidation --distribution-id ${distribution.id} --paths /\*`,
      triggers: [staticHash.hash, prerenderedHash.hash],
    },
    {
      dependsOn: [distribution],
    }
  )
}
