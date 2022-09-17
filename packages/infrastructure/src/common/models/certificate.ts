import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

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
    super("freedev:index:SSLCertificate", name, {}, opts);

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