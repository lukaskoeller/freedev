import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { HttpMethod, Microservice } from '../common/models';

export const createApi = () => {
  const api = new aws.apigatewayv2.Api("httpApiGateway", {
    protocolType: "HTTP",
  });

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
