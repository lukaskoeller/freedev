import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as path from "path";
import { config } from './website.config';
import { BucketPair, BucketObjects } from "../../common/models/bucket";

export const websiteS3 = (originAccessIdentity: aws.cloudfront.OriginAccessIdentity) => {
  const NAME = 'web';
  /**
   * S3 bucket that the website's contents will be stored in.
   * 
   * The bucket is not configured as website
   * If your origin is an Amazon S3 bucket that’s configured as a website endpoint,
   * you can’t configure CloudFront to use HTTPS with your origin
   * because Amazon S3 doesn’t support HTTPS for website endpoints.
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-custom-origin.html
   */
  const websiteBucket = new BucketPair(NAME, {
    bucketName: config.targetDomain.replace('.', '-'),
    policy: (bucket) => pulumi.all([originAccessIdentity.iamArn, bucket.contentBucket.arn]).apply(([oaiArn, bucketArn]) =>JSON.stringify({
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
  }))
  });

  // Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
  // const webContentsRootPath = path.join(process.cwd(), config.pathToWebsiteContents);
  const webContentsPrerenderedPath = path.join(
    process.cwd(),
    `${config.pathToWebsiteContents}/prerendered`
  );
  const webContentsAssetsPath = path.join(
    process.cwd(),
    `${config.pathToWebsiteContents}/assets`
  );

  console.log(`Syncing contents from local disk at ${webContentsPrerenderedPath} and ${webContentsAssetsPath}`);

  new BucketObjects(`${NAME}-prerendered`, {
    path: webContentsPrerenderedPath,
    bucket: websiteBucket.contentBucket,
  });

  new BucketObjects(`${NAME}-assets`, {
    path: webContentsAssetsPath,
    bucket: websiteBucket.contentBucket,
  });

  return {
    contentBucket: websiteBucket.contentBucket,
    logsBucket: websiteBucket.logsBucket,
  }
};