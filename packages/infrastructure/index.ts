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

class Microservice {
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

const emailConfiguration = new aws.ses.ConfigurationSet("email-sign-up-verification", {
  deliveryOptions: {
      tlsPolicy: "Require",
  },
  sendingEnabled: true,
  // trackingOptions @todo enable or not?
});

export const emailConfigurationArn = emailConfiguration.arn;

const emailIdentity = new aws.ses.EmailIdentity("hey-freedev-email-identity", {
  email: "hey@freedev.app",
});

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
  emailConfiguration: {
    configurationSet: emailConfiguration.name,
    emailSendingAccount: 'DEVELOPER',
    fromEmailAddress: 'freedev <hey@freedev.app>',
    replyToEmailAddress: 'hey@freedev.app',
    sourceArn: emailIdentity.arn,
  },
  verificationMessageTemplate: {
    defaultEmailOption: 'CONFIRM_WITH_CODE',
    emailMessage: 'freedev says hello! Use {####} to confirm your sign up.',
    emailSubject: 'Verify your account with freedev',
  },
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

const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {
  userPoolId: userPool.id,
});

const api = new aws.apigatewayv2.Api("httpApiGateway", {
  protocolType: "HTTP",
});

const apiStage = new aws.apigatewayv2.Stage(`${pulumi.getStack()}-api-stage`, {
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

export const endpoint = pulumi.interpolate`${api.apiEndpoint}/${apiStage.name}`;

/**
 * @todo Iterate through openapi.json and create new Microservice.
 */
const signup = new Microservice({
  name: 'sign-up',
  path: '/sign-up',
  httpMethod: HttpMethod.PUT,
  api,
});

const root = new Microservice({
  name: 'default',
  path: '$default',
  api,
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
