import { api, HttpMethod, Microservice } from '../../common/models';

/**
 * @todo Iterate through openapi.json and create new Microservice.
 */
 export const signUpEndpoint = new Microservice({
  name: 'sign-up',
  path: '/sign-up',
  httpMethod: HttpMethod.PUT,
  api,
});