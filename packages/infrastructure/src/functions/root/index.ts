import { api, Microservice } from "../../common/models";

/**
 * Root of website (homepage). Path is '/' or 'https://freedev.app'.
 */
export const rootEndpoint = new Microservice({
  name: 'default',
  path: '$default',
  api,
});
