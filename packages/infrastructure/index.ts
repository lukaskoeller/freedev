import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import openapi from './api.json';
import { User } from "@pulumi/aws/cognito";
import { APIGatewayEvent } from "aws-lambda";
import { Context } from "@pulumi/aws/lambda";
import { RestExceptionNoBody } from "errors";

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

// Create a Lambda Function
const helloHandler = new aws.lambda.CallbackFunction("hello-handler", {
  callback: async (ev, ctx) => {
    return {
      statusCode: 200,
      body: "Hello, API Gateway!",
    };
  },
});

export type SignupBody = {
  email: string;
  password: string;
}

const signup = new aws.lambda.CallbackFunction("signup", {
  callback: async (event: APIGatewayEvent, context: Context) => {
    // const user = new User()
    console.log('LOG:LOG:LOG:LOG', {
      event,
      context,
    });
    if (!event?.body) {
      throw RestExceptionNoBody
    }
    console.log('BODY!!!', event?.body);
    
    const body: SignupBody = JSON.parse(event?.body);
    const { email, password } = body;

    const user = new aws.cognito.User('email', {
      userPoolId: userPool.id,
      username: email,
      password,
    });
    console.log('USER!!!', user);
    
    return {
      statusCode: 200,
      body: "Hello, API Gateway!",
    };
  },
});

// Define an endpoint that invokes a lambda to handle requests
const api = new apigateway.RestAPI("freedev-api", {
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