import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export enum APIStage {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  // @todo to be continued
}

export type MicroserviceParams = {
  /**
   * Name of the route.
   */
  name: string;
  /**
   * Path of the route.
   * Must start with a forward slash (/).
   * @example `/user`
   */
  path: string;
  /**
   * Is required except that path is "$default"
   */
  httpMethod?: HttpMethod;
  api: aws.apigatewayv2.Api;
}

export class Microservice {
  /**
   * Lambda IAM Role
   * @description Creates the IAM Role for the Lambda Function.
   */
  lambdaIamRole: aws.iam.Role;
  /**
   * Lambda Role Attachment
   * @description Attaches an IAM Role to the Lambda Function. This allows the Lambda to log to CloudWatch.
   */
  lambdaRoleAttachment: aws.iam.RolePolicyAttachment;
  /**
   * Lambda
   * @description Creates the Lambda function
   */
  lambda: aws.lambda.Function;
  /**
   * API Gateway v2
   * @description: Creates the HTTP API using the APIGateway v2
   */
  apigatewayv2: aws.apigatewayv2.Api;
  /**
   * Lambda Permission
   * @description Gives apigatewayv2 permission to access the Lambda function.
   */
  lambdaPermission: aws.lambda.Permission;
  /**
   * API Gateway v2 Integration
   * @description Integrates the Lambda Function with the APIGateway
   */
  apigatewayv2Integration: aws.apigatewayv2.Integration;
  /**
   * API Gateway v2 Route
   * @description Route to be added to the API
   */
  apigatewayv2Route: aws.apigatewayv2.Route;
  /**
   * API Gateway v2 Stage
   * Stage of route of the API
   * @see {APIStage}
   */
  // apigatewayv2Stage: aws.apigatewayv2.Stage;
  /**
   * Returns the API URL when deploying via pulumi.
   */
  // endpoint: pulumi.Output<string>;

  /**
   * Initiates a microservice creating a lambda, an api route and an integration for both.
   * @param {MicroserviceParams} parameters
   */
  constructor(parameters: MicroserviceParams) {
    this.lambdaIamRole = new aws.iam.Role(`${parameters.name}-lambda-iam-role`, {
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
    });

    this.lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(`${parameters.name}-lambda-role-attachment`, {
      role: this.lambdaIamRole,
      policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    });

    this.lambda = new aws.lambda.Function(parameters.name, {
      code: new pulumi.asset.AssetArchive({
        '.': new pulumi.asset.FileArchive(`../functions/build/${parameters.name}`),
      }),
      role: this.lambdaIamRole.arn,
      handler: "index.handler",
      runtime: "nodejs16.x",
      // environment: {
      //     variables: {
      //         foo: "bar",
      //     },
      // },
    });

    this.apigatewayv2 = parameters.api;

    this.lambdaPermission = new aws.lambda.Permission(`${parameters.name}-lambda-permission`, {
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      function: this.lambda,
      sourceArn: pulumi.interpolate`${this.apigatewayv2.executionArn}/*/*`,
    }, {dependsOn: [this.apigatewayv2, this.lambda]});

    this.apigatewayv2Integration = new aws.apigatewayv2.Integration(`${parameters.name}-lambda-integration`, {
      apiId: this.apigatewayv2.id,
      integrationType: "AWS_PROXY",
      integrationUri: this.lambda.arn,
      integrationMethod: "POST",
      payloadFormatVersion: "2.0",
      passthroughBehavior: "WHEN_NO_MATCH",
    });

    this.apigatewayv2Route = new aws.apigatewayv2.Route(`${parameters.name}-api-route`, {
      apiId: this.apigatewayv2.id,
      routeKey: `${parameters?.httpMethod ? `${parameters?.httpMethod} ` : ''}${parameters.path}`,
      target: pulumi.interpolate`integrations/${this.apigatewayv2Integration.id}`,
    });
  }
}

export const api = new aws.apigatewayv2.Api("httpApiGateway", {
  protocolType: "HTTP",
});

export const apiStage = new aws.apigatewayv2.Stage(`${pulumi.getStack()}-api-stage`, {
  apiId: api.id,
  // @see https://stackoverflow.com/questions/61027859/conflictexception-stage-already-exist-from-aws-api-gateway-deployment-with-stag
  name: pulumi.getStack(), // @todo rework?
  autoDeploy: true,
  // deploymentId: `${pulumi.getStack()}-api-deployment-id`,
  // @todo integrate into microservice!?
  // routeSettings: [
  //   {
  //     routeKey: this.apigatewayv2Route.routeKey,
  //     throttlingBurstLimit: 5000,
  //     throttlingRateLimit: 10000,
  //   },
  // ],
  // autoDeploy: true,
});

// const apiDeployment = new aws.apigatewayv2.Deployment("freedev-api-deployment", {
//   apiId: api.id,
//   description: "freedev api deployment",
// }, {
//   dependsOn: [
//     signup.apigatewayv2Route,
//     root.apigatewayv2Route,
//   ]
// });

export const endpoint = pulumi.interpolate`${api.apiEndpoint}/${apiStage.name}`;
