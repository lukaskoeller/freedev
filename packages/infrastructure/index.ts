import { createApi } from './src/functions';
import { createDatabase, createUserPoolAndClient } from './src/resources';
/**
 * Cognito User Pool
 * Includes email configuration
 */
export const { userPoolEndpoint, userPoolClientId } =  createUserPoolAndClient();

/**
 * API Gateway v2
 */
createApi({ userPoolClientId, userPoolEndpoint });

/**
 * DynamDB Database
 */
const database = createDatabase();
export const databaseArn = database.arn;
export const databaseName = database.name;
