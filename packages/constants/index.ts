/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
export const AWS_REGION = 'eu-central-1';
/**
 * AWS Account ID
 */
export const AWS_ACCOUNT_ID = '865039251033';
/**
 * Cognito User Pool Client ID
 */
export const USER_POOL_CLIENT_ID = 'l676voiseqvtmtgpk9fl0mi5d';
/**
 * Cognito User Pool ID
 */
export const USER_POOL_ID = 'eu-central-1_RhkLD4h08';
/**
 * Main DynamoDB Table Name
 */
export const DYNAMO_DB_TABLE_NAME = 'main-dynamodb-table-bfad842';
export const DYNAMO_DB_TABLE_NAME_INDEX = 'handle-index';
export const DYNAMO_DB_TABLE_ARN = 'arn:aws:dynamodb:eu-central-1:865039251033:table/main-dynamodb-table-bfad842';

/**
 * DynamoDB Prefixes to determine data type
 * in a single table application.
 */
export enum DBKeyPrefix {
  User = 'USER#',
  Skill = 'SKILL#',
}

export const AWS_ROUTE_53_ZONE_NAME = 'freedev.app';

export const STACK_NAME = 'freedev-app';
export const ROLE_SESSION_NAME = 'serverless-workflows-deployment';
export const GITHUB_ACTIONS_ROLE_TO_ASSUME = 'GitHubActionRole';