import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
// import openapi from './api.json';

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// // Export the name of the bucket
// export const bucketName = bucket.id;

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

export const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {userPoolId: userPool.id});

// Create a Lambda Function
const helloHandler = new aws.lambda.CallbackFunction("hello-handler", {
  callback: async (ev, ctx) => {
    return {
      statusCode: 200,
      body: "Hello, API Gateway!",
    };
  },
});

const iamForLambda = new aws.iam.Role("iamForLambda", {
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
  managedPolicyArns: [
    // Allow AWS Lambda to log to CloudWatch
    'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
  ]
});

const signup = new aws.lambda.Function("sign-up", {
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive("../functions/build/sign-up"),
  }),
  role: iamForLambda.arn,
  handler: "index.handler",
  runtime: "nodejs16.x",
  // environment: {
  //     variables: {
  //         foo: "bar",
  //     },
  // },
});

export enum APIStage {
  Development = 'dev',
  Production = 'prod',
}

// Define an endpoint that invokes a lambda to handle requests
const api = new apigateway.RestAPI("freedev-api", {
  stageName: APIStage.Development,
  routes: [
    {
      path: "/",
      method: "GET",
      eventHandler: helloHandler,
    },
    {
      path: "/signup",
      method: "PUT",
      eventHandler: signup,
    },
  ],
});

export const apiUrl = api.url;