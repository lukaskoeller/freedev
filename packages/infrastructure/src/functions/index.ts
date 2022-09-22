import { api, HttpMethod, Microservice } from '../common/models';

export const createApi = () => {
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
}
