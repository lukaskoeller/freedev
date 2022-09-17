import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as mime from "mime";
import { crawlDirectory } from "../../common/utils";

export interface BucketPairArgs {
  /**
   * Name of the bucket in AWS.
   */
  bucketName: string;
  /**
   * Function that returns the text of the policy.
   * The `BucketPair` (or `this`) is passed as argument so you can use resources
   * created within the policy.
   * Alternatively, just a `string` or `aws.iam.PolicyDocument`.
   * 
   * Although this is a bucket policy rather than an IAM policy,
   * the `aws.iam.getPolicyDocument` data source may be used,so long as it
   * specifies a principal. Note: Bucket policies are limited to 20 KB in size.
   * 
   * @example ```ts
   * (bucket) => pulumi.all([originAccessIdentity.iamArn, bucket.contentBucket.arn]).apply()
   * ```
   */
  policy: (bucketPair: BucketPair) => pulumi.Input<string | aws.iam.PolicyDocument> | pulumi.Input<string | aws.iam.PolicyDocument>;
}

export class BucketPair extends pulumi.ComponentResource {
  contentBucket: aws.s3.Bucket;
  bucketPolicy: aws.s3.BucketPolicy;
  logsBucket: aws.s3.Bucket;
  
  constructor(name: string, args: BucketPairArgs, opts?: pulumi.ComponentResourceOptions) {
      super("freedev:index:BucketPair", name, {}, opts);

      this.contentBucket = new aws.s3.Bucket(`${name}-bucket-content`, {
        bucket: args.bucketName,
      }, { parent: this });

      this.bucketPolicy = new aws.s3.BucketPolicy(`${name}-bucket-policy`, {
        bucket: this.contentBucket.id, // refer to the bucket created earlier
        policy: args.policy(this),
      }, { parent: this });

      this.logsBucket = new aws.s3.Bucket(`${name}-bucket-logs`, {
        bucket: `${args.bucketName}-logs`,
        acl: "private",
      }, { parent: this });

      // Register output properties for this component
      this.registerOutputs({
        contentBucket: this.contentBucket,
        bucketPolicy: this.bucketPolicy,
        logsBucket: this.logsBucket,
      });
  }
}

export interface BucketObjectsArgs {
  /**
   * Relative path to the directory of
   * the files to be created as bucket objects.
   */
  path: string;
  /**
   * Provides a S3 bucket resource.
   */
  bucket: aws.s3.Bucket;
}

export class BucketObjects extends pulumi.ComponentResource {
  bucketObject: (filePath: string) => aws.s3.BucketObject;

  constructor(name: string, args: BucketObjectsArgs, opts?: pulumi.ComponentResourceOptions) {
    super("freedev:index:BucketObjects", name, {}, opts);

    this.bucketObject = (filePath: string) => {
      const relativeFilePath = filePath.replace(args.path + "/", "");
      return new aws.s3.BucketObject(
        relativeFilePath,
        {
          key: relativeFilePath,
          acl: "public-read",
          bucket: args.bucket,
          contentType: mime.getType(filePath) || undefined,
          source: new pulumi.asset.FileAsset(filePath),
        },
        {
          parent: args.bucket,
      });
    }

    crawlDirectory(args.path, this.bucketObject);

    // Register output properties for this component
    this.registerOutputs();
  }
}