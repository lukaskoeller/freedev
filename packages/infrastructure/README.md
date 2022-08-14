# Infrastructure

## Parking Lot

```typescript
// Define whole API using swagger (OpenAPI)
const api = new aws.apigateway.RestApi("api", {
  body: JSON.stringify(openapi),
});

const resource = new aws.apigateway.Resource("number", {
  pathPart: "number",
  parentId: api.rootResourceId,
  restApi: api.id,
});

// Create the role for the Lambda to assume
const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
});

// Attach the fullaccess policy to the Lambda role created above
const rolepolicyattachment = new aws.iam.RolePolicyAttachment("lambdaRoleAttachment", {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// Create the Lambda to execute
const lambda = new aws.lambda.Function("handleApiTest", {
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./src/lambdas"),
  }),
  runtime: "nodejs12.x",
  role: lambdaRole.arn,
  handler: "index.handler",
});

const method = new aws.apigateway.Method("method", {
  restApi: api.id,
  resourceId: resource.id,
  httpMethod: "GET",
  authorization: "NONE",
});

// Give API Gateway permissions to invoke the Lambda
const lambdapermission = new aws.lambda.Permission("apiGatewayLambda", {
  action: "lambda:InvokeFunction",
  principal: "apigateway.amazonaws.com",
  function: lambda,
});

const integration = new aws.apigateway.Integration("/testo", {
  restApi: api.id,
  resourceId: resource.id,
  httpMethod: method.httpMethod,
  integrationHttpMethod: "POST",
  type: "AWS_PROXY",
  uri: lambda.invokeArn,
})

// "x-amazon-apigateway-integration": {
//   "httpMethod": "POST",
//   "passthroughBehavior": "when_no_match",
//   "type": "aws_proxy",
//   "uri": "arn:aws:apigateway:eu-central-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-central-1:865039251033:function:handleApiTest-3eb5a4f/invocations"
// }
```

```ts
const user = new aws.cognito.User('email', {
  userPoolId: userPool.id,
  username: email,
  password,
});
```

```ts
// Define an endpoint that invokes a lambda to handle requests
// const api = new aws.apigateway.RestApi("freedev-api", {
//   body: JSON.stringify({
//     openapi: "3.0.1",
//     info: {
//       version: "1.0.0",
//       title: "freedev",
//     },
//     paths: {
//       "/signup": {
//         put: {
//           requestBody: {
//             content: {
//               'multipart/form-data': {
//                 schema: {
//                   type: 'object',
//                   properties: {
//                     email: {
//                       type: 'string',
//                     },
//                     password: {
//                       type: 'string',
//                     }
//                   }
//                 }
//               }
//             }
//           },
//           "x-amazon-apigateway-integration": {
//             httpMethod: "POST",
//             // passthroughBehavior: "when_no_match",
//             type: "AWS_PROXY",
//             uri: pulumi.interpolate `arn:aws:apigateway:eu-central-1:lambda:path/2015-03-31/functions/${signup.invokeArn}/invocations`,
//           },
//         }
//       },
//       // "/": {
//       //     get: {
//       //         "x-amazon-apigateway-integration": {
//       //             httpMethod: "GET",
//       //             payloadFormatVersion: "1.0",
//       //             type: "HTTP_PROXY",
//       //             uri: "https://ip-ranges.amazonaws.com/ip-ranges.json",
//       //         },
//       //     },
//       // },
//   },
//   }),
//   // [
//   //   {
//   //     path: "/",
//   //     method: "GET",
//   //     eventHandler: helloHandler,
//   //   },
//   //   {
//   //     path: "/signup",
//   //     method: "PUT",
//   //     eventHandler: signup,
//   //   },
//   // ],
//   binaryMediaTypes: [
//     'multipart/form-data',
//   ],
// }, { dependsOn: [signup] });

// const apiDeployment = new aws.apigateway.Deployment("freedev-api-deployment", {
//   restApi: api.id,
// });

// const apiStageDev = new aws.apigateway.Stage("freedev-api-stage-dev", {
//   deployment: apiDeployment.id,
//   restApi: api.id,
//   stageName: APIStage.Development,
// });

// const myApi = await aws.apigateway.getRestApi({
//   name: "freedev-api",
// });

// const myResource = await aws.apigateway.getResource({
//   restApiId: myApi.id,
//   path: "/signup",
// });

// console.log('api.id', api.id);
// console.log('myApi.id', myApi.id);
// console.log('myResource.id', myResource.id);
// console.log('typeof myResource.id', typeof myResource.id);
// console.log('myResource', myResource);
// console.log('signup.invokeArn', signup.invokeArn);

// const signupIntegration = new aws.apigateway.Integration('signupIntegration', {
//   httpMethod: 'PUT',
//   integrationHttpMethod: 'POST', // @see https://www.pulumi.com/registry/packages/aws/api-docs/apigateway/integration/#integrationhttpmethod_nodejs
//   resourceId: myResource.id,
//   restApi: api.id,
//   type: 'AWS_PROXY',
//   uri: signup.invokeArn,
// });

// export const apiUrl = api.url;  
// }
```