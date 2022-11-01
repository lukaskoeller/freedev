import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { HttpMethod, Microservice } from '../common/models';
import { UserPool } from "@pulumi/aws/cognito";
import { userPoolClientId } from "../..";

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
  const signUpEndpoint = new Microservice({
    name: 'sign-up',
    path: '/sign-up',
    httpMethod: HttpMethod.PUT,
    api,
  });

  /**
   * Confirms sign up via a code sent through cognito and SES.
   */
  const confirmSignUpEndpoint = new Microservice({
    name: 'confirm-sign-up',
    path: '/confirm-sign-up',
    httpMethod: HttpMethod.POST,
    api,
  });

  // @todo change to {username}
  const profile = new Microservice({
    name: 'profile',
    path: '/profile/{profileName}',
    httpMethod: HttpMethod.GET,
    api,
    authorizerId,
  });

  const signIn = new Microservice({
    name: 'sign-in',
    path: '/sign-in',
    httpMethod: HttpMethod.POST,
    api,
    authorizerId,
  });

  /**
   * Root of website (homepage). Path is '/' or 'https://freedev.app'.
   */
  const rootEndpoint = new Microservice({
    name: 'default',
    path: '$default',
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
