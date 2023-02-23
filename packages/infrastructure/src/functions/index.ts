import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { HttpMethod, ApiEndpoint } from '../common/models';
import { UserPool } from "@pulumi/aws/cognito";
import { userPoolClientId } from "../..";
import { policyReadOnlyDynamodb, policyReadWriteDynamodb, policyWriteDynamodb } from '../common/policies/index';

export type CreateApiArgs = {
  /**
   * Cognito user pool endpoint
   */
  userPoolEndpoint: UserPool['endpoint'],
  userPoolClientId: UserPool['id'],
}

export const createApi = (args: CreateApiArgs) => {
  const api = new aws.apigatewayv2.Api("httpApiGateway", {
    protocolType: "HTTP",
  });

  const apiAuthorizer = new aws.apigatewayv2.Authorizer("httpApiGatewayAuthorizer", {
    apiId: api.id,
    authorizerType: "JWT",
    identitySources: [`$request.header.Authorization`],
    jwtConfiguration: {
      issuer: pulumi.interpolate`https://${args.userPoolEndpoint}`,
      audiences: [userPoolClientId],
    },
  });

  const authorizerId = apiAuthorizer.id;

  /**
   * @todo Iterate through openapi.json and create new Microservice.
   */
  const signUpEndpoint = new ApiEndpoint('sign-up', {
    path: '/sign-up',
    functionsPath: 'api-put-sign-up',
    httpMethod: HttpMethod.PUT,
    api,
  });

  /**
   * Allow Lambda to execute dynamoDB operations
   * @see https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html#events-dynamodb-permissions
   */
  new aws.iam.RolePolicyAttachment('sign-up-lambda-role-attachment-dynamodb', {
    role: signUpEndpoint.lambdaIamRole,
    policyArn: policyReadWriteDynamodb.arn,
  }, { parent: signUpEndpoint });

  /**
   * Confirms sign up via a code sent through cognito and SES.
   */
  const confirmSignUpEndpoint = new ApiEndpoint('confirm-sign-up', {
    path: '/confirm-sign-up',
    functionsPath: 'api-post-confirm-sign-up',
    httpMethod: HttpMethod.POST,
    api,
  });

  const userHandleEndpoint = new ApiEndpoint('user-handle', {
    path: '/user/{handle}',
    functionsPath: 'api-get-user-handle',
    httpMethod: HttpMethod.GET,
    api,
    authorizerId,
  });

  new aws.iam.RolePolicyAttachment('user-handle-lambda-role-attachment-dynamodb', {
    role: userHandleEndpoint.lambdaIamRole,
    policyArn: policyReadOnlyDynamodb.arn,
  }, { parent: userHandleEndpoint });

  const userEndpoint = new ApiEndpoint('user', {
    path: '/user',
    functionsPath: 'api-get-user',
    httpMethod: HttpMethod.GET,
    api,
    authorizerId,
  });

  new aws.iam.RolePolicyAttachment('user-lambda-role-attachment-dynamodb', {
    role: userEndpoint.lambdaIamRole,
    policyArn: policyReadOnlyDynamodb.arn,
  }, { parent: userEndpoint });

  const userPutEndpoint = new ApiEndpoint('api-put-user', {
    path: '/user',
    functionsPath: 'api-put-user',
    httpMethod: HttpMethod.PUT,
    api,
    authorizerId,
  });

  new aws.iam.RolePolicyAttachment('api-put-user-lambda-role-attachment-dynamodb', {
    role: userPutEndpoint.lambdaIamRole,
    policyArn: policyWriteDynamodb.arn,
  }, { parent: userPutEndpoint });

  const skillsPutEndpoint = new ApiEndpoint('api-put-skills', {
    path: '/user/skills',
    functionsPath: 'api-put-skills',
    httpMethod: HttpMethod.PUT,
    api,
    authorizerId,
  });

  new aws.iam.RolePolicyAttachment('api-put-skills-lambda-role-attachment-dynamodb', {
    role: skillsPutEndpoint.lambdaIamRole,
    policyArn: policyWriteDynamodb.arn,
  }, { parent: skillsPutEndpoint });

  const signIn = new ApiEndpoint('sign-in', {
    path: '/sign-in',
    functionsPath: 'api-post-sign-in',
    httpMethod: HttpMethod.POST,
    api,
  });

  const refreshToken = new ApiEndpoint('refresh-token', {
    path: '/refresh-token',
    functionsPath: 'api-post-refresh-token',
    httpMethod: HttpMethod.POST,
    api,
  });

  /**
   * Root of website (homepage). Path is '/' or 'https://freedev.app'.
   */
  const rootEndpoint = new ApiEndpoint('default', {
    path: '$default',
    functionsPath: 'api-default',
    api,
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

  // const apiDeployment = new aws.apigatewayv2.Deployment("freedev-api-deployment", {
  //   apiId: api.id,
  //   description: "freedev api deployment",
  // }, {
  //   dependsOn: [
  //     signup.apigatewayv2Route,
  //     root.apigatewayv2Route,
  //   ]
  // });

  const endpoint = pulumi.interpolate`${api.apiEndpoint}/${apiStage.name}`;
}
