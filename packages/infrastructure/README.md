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