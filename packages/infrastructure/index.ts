import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import api from './api.json';

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
  usernameAttributes: ['phone_number', 'email'],
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

// @todo Create swagger-api with api gateway
// @see https://github.com/pulumi/examples/tree/master/aws-apigateway-ts-routes

// Docs on enabling a cognito user pool in aws api gateway
// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enable-cognito-user-pool.html

// Define whole API using swagger (OpenAPI)
const swaggerAPI = new apigateway.RestAPI("swagger-api", {
  swaggerString: JSON.stringify(api),
});

// Configure IAM so that the AWS Lambda can be run.
const handleApiTestRole = new aws.iam.Role("handleApiTestRole", {
  assumeRolePolicy: {
     Version: "2012-10-17",
     Statement: [{
        Action: "sts:AssumeRole",
        Principal: {
           Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
     }],
  },
});
new aws.iam.RolePolicyAttachment("zipTpsReportsFuncRoleAttach", {
  role: handleApiTestRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const handleApiTest = new aws.lambda.Function("handleApiTest", {
  // Upload the code for our Lambda from the "./app" directory:
  code: new pulumi.asset.AssetArchive({
     ".": new pulumi.asset.FileArchive("./app"),
  }),
  runtime: "nodejs12.x",
  role: handleApiTestRole.arn,
})
