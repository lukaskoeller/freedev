import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import { ApiErrorResponse, ApiResponse } from "../common/utils";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { DYNAMO_DB_TABLE_NAME, DYNAMO_DB_TABLE_NAME_INDEX, USER_POOL_CLIENT_ID, USER_POOL_ID } from "../common/constants";
import { DynamoDBService } from "../common/services/dynamodb.services";
import { User } from "../common/modules/user/user.entities";


const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: USER_POOL_CLIENT_ID,
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    console.log({ event, context });
    
    const handle = event?.['pathParameters']?.['handle'];
    console.log('HANDLE', handle);

    if (!handle) {
      throw new ApiErrorResponse({
        statusCode: 400,
        body: {
          status: 400,
          message: 'No handle was provided. Make sure the path is as follows: **/user/{handle}.',
          debugMessage: 'Make sure the link includes the handle of the user.'
        },
      })
    }

    const clientDynamodb = new DynamoDBService({
      tableName: DYNAMO_DB_TABLE_NAME,
      indexName: DYNAMO_DB_TABLE_NAME_INDEX,
    });

    const user = new User({ username: handle });
    const response = await clientDynamodb.read({
      pk: user.pk,
    });
    console.log('USER', user);
    

    return new ApiResponse({
      statusCode: 200,
      body: response,
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