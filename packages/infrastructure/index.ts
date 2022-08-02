import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import openapi from './api.json';

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// // Export the name of the bucket
// export const bucketName = bucket.id;

export = async () => {
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
  
  const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {userPoolId: userPool.id});
  
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
  
  enum APIStage {
    Development = 'dev',
    Production = 'prod',
  }
  
  // Define an endpoint that invokes a lambda to handle requests
  const api = new aws.apigateway.RestApi("freedev-api", {
    body: JSON.stringify({
      openapi: "3.0.1",
      info: {
        version: "1.0.0",
        title: "freedev",
      },
      paths: {
        "/signup": {
          put: {
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                      },
                      password: {
                        type: 'string',
                      }
                    }
                  }
                }
              }
            }
          }
        },
        // "/": {
        //     get: {
        //         "x-amazon-apigateway-integration": {
        //             httpMethod: "GET",
        //             payloadFormatVersion: "1.0",
        //             type: "HTTP_PROXY",
        //             uri: "https://ip-ranges.amazonaws.com/ip-ranges.json",
        //         },
        //     },
        // },
    },
    }),
    // [
    //   {
    //     path: "/",
    //     method: "GET",
    //     eventHandler: helloHandler,
    //   },
    //   {
    //     path: "/signup",
    //     method: "PUT",
    //     eventHandler: signup,
    //   },
    // ],
    binaryMediaTypes: [
      'multipart/form-data',
    ],
  });
  
  const myApi = aws.apigateway.getRestApi({
    name: "freedev-api",
  });
  
  const myResource = await myApi.then(api => aws.apigateway.getResource({
    restApiId: api.id,
    path: "/signup",
  }));
  
  const signupIntegration = new aws.apigateway.Integration('signupIntegration', {
    httpMethod: 'PUT',
    resourceId: myResource.id,
    restApi: api.id,
    type: 'AWS_PROXY',
  }
  );
  
  const apiDeployment = new aws.apigateway.Deployment("exampleDeployment", {
    restApi: api.id,
  });
  
  const apiStageDev = new aws.apigateway.Stage("freedev-api-stage-dev", {
    deployment: apiDeployment.id,
    restApi: api.id,
    stageName: APIStage.Development,
  });
  
  // export const apiUrl = api.url;  
}
