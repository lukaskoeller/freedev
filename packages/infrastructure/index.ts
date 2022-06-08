import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// // Export the name of the bucket
// export const bucketName = bucket.id;

const pool = new aws.cognito.UserPool('appPool', {
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
  aliasAttributes: ['phone_number', 'email'],
  passwordPolicy: {
    minimumLength: 10,
    requireLowercase: true,
    requireSymbols: true,
  }
})
