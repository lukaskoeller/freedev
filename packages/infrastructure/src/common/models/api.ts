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

export type ApiEndpointArgs = {
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
  authorizerId?: pulumi.Output<string>;
};

export class ApiEndpoint extends pulumi.ComponentResource {
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

  constructor(name: string, args: ApiEndpointArgs, opts?: pulumi.ComponentResourceOptions) {
    super("freedev:index:ApiEndpoint", name, {}, opts);

    this.lambdaIamRole = new aws.iam.Role(`${name}-lambda-iam-role`, {
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
    }, { parent: this });

    this.lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(`${name}-lambda-role-attachment`, {
      role: this.lambdaIamRole,
      policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }, { parent: this });

    this.lambda = new aws.lambda.Function(name, {
      code: new pulumi.asset.AssetArchive({
        '.': new pulumi.asset.FileArchive(`../functions/build/${name}`),
      }),
      role: this.lambdaIamRole.arn,
      handler: "index.handler",
      runtime: "nodejs16.x",
      // environment: {
      //     variables: {
      //         foo: "bar",
      //     },
      // },
    }, { parent: this });

    this.apigatewayv2 = args.api;

    this.lambdaPermission = new aws.lambda.Permission(`${name}-lambda-permission`, {
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      function: this.lambda,
      sourceArn: pulumi.interpolate`${this.apigatewayv2.executionArn}/*/*`,
    }, { dependsOn: [this.apigatewayv2, this.lambda], parent: this });

    this.apigatewayv2Integration = new aws.apigatewayv2.Integration(`${name}-lambda-integration`, {
      apiId: this.apigatewayv2.id,
      integrationType: "AWS_PROXY",
      integrationUri: this.lambda.arn,
      integrationMethod: "POST",
      payloadFormatVersion: "2.0",
      passthroughBehavior: "WHEN_NO_MATCH",
    }, { parent: this });

    this.apigatewayv2Route = new aws.apigatewayv2.Route(`${name}-api-route`, {
      apiId: this.apigatewayv2.id,
      routeKey: `${args?.httpMethod ? `${args?.httpMethod} ` : ''}${args.path}`,
      target: pulumi.interpolate`integrations/${this.apigatewayv2Integration.id}`,
      ...args?.authorizerId ? {
        authorizerId: args.authorizerId,
        authorizationType: 'JWT'
      } : {},
    }, { parent: this });

    // Register output properties for this component
    this.registerOutputs({
      lambdaIamRole: this.lambdaIamRole,
      lambdaRoleAttachment: this.lambdaRoleAttachment,
      lambda: this.lambda,
      lambdaPermission: this.lambdaPermission,
      apigatewayv2Integration: this.apigatewayv2Integration,
      apigatewayv2Route: this.apigatewayv2Route,
    });
  }
}