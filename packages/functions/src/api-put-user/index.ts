import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import { ApiErrorResponse, ApiResponse, NoBodyException } from "../common/utils";
import { DYNAMO_DB_TABLE_NAME, USER_POOL_CLIENT_ID, USER_POOL_ID } from "@freedev/constants";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { User } from "../common/modules/user/user.entities";
import { ItemKey } from "../common/modules/base.entities";
import { DynamoDBService } from "../common/services/dynamodb.services";

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: USER_POOL_CLIENT_ID,
});

// @todo use for body schema validation https://github.com/colinhacks/zod
export type PutUserBody = Partial<User>;

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw NoBodyException;
  }

  const token = event?.headers?.authorization?.replace('Bearer ', '');
  console.log('token', token);

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
  const userKeys = new User({ username }).keys();
  console.log('USER_KEYS', userKeys);
  
  const body: PutUserBody = JSON.parse(event?.body);
  
  const clientDynamodb = new DynamoDBService({ tableName: DYNAMO_DB_TABLE_NAME });

  const input: PutUserBody & ItemKey = {
    ...userKeys,
    ...body,
  };

  try {
    const data = await clientDynamodb.update(input);
    console.log(data);

    return new ApiResponse({
      statusCode: 200,
      body: data,
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