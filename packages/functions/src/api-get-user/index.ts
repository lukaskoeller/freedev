import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import { ApiErrorResponse, ApiResponse } from "../common/utils";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { DBPrefix, DYNAMO_DB_TABLE_NAME, DYNAMO_DB_TABLE_NAME_INDEX, USER_POOL_CLIENT_ID, USER_POOL_ID } from "../common/constants";
import { DynamoDBService } from "../common/services/dynamodb.services";


const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: USER_POOL_CLIENT_ID,
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    console.log({ event, context });
    console.log('!!!/profile/{handle}');
    
    const handle = event?.['pathParameters']?.['handle'];
    console.log();

    const token = event?.headers?.authorization?.replace('Bearer ', '');
    console.log('TOKEN', token);
    

    if (!token) {
      throw new ApiErrorResponse({
        statusCode: 401,
        body: {
          status: 401,
          message: 'Unable to get the user information you requested. Please ensure that you are signed in and try again.',
          debugMessage: 'No access token was provided in the `headers.authorization`. Make sure it is added during fetch.'
        },
      })
    }

    const payload = await verifier.verify(token);
    const username = payload.username;

    const clientDynamodb = new DynamoDBService({
      tableName: DYNAMO_DB_TABLE_NAME,
      indexName: DYNAMO_DB_TABLE_NAME_INDEX,
    });

    const user = await clientDynamodb.read({
      pk: `${DBPrefix.User}${username}`,
      sk: `${DBPrefix.User}${username}`,
    });

    return new ApiResponse({
      statusCode: 200,
      body: { message: 'Your user is in progress...' },
    });
  } catch (error) {
    // @todo add throw Error as return
    console.log('!!!ERROR!!!', error);

    return new ApiErrorResponse({
      statusCode: error?.statusCode ?? 500,
      body: {
        status: error?.statusCode ?? 500,
        message: error?.message
          ? `${error?.message}${error?.code ?? ` (${error?.code}`}`
          : DEFAULT_ERROR_MESSAGE,
        debugMessage: 'Some text to debug the error',
      }
    });
  } finally {
    // finally.
  }
};