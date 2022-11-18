import { APIGatewayEvent, APIGatewayProxyEventV2, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import { ApiErrorResponse, ApiResponse, NoBodyException } from "../common/utils";
import { AWS_REGION, DBPrefix, DYNAMO_DB_TABLE_NAME, USER_POOL_CLIENT_ID } from "../common/constants";
import { DynamoDBService } from "../common/services/dynamodb.services";

export type SignUpBody = {
  email: string;
  password: string;
}

export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
  if (!event?.body) {
    throw NoBodyException;
  }
  
  const body: SignUpBody = JSON.parse(event?.body);
  const { email, password } = body;
  
  // a client can be shared by different commands.
  const clientCognito = new CognitoIdentityProviderClient({ region: AWS_REGION });
  const clientDynamodb = new DynamoDBService({ tableName: DYNAMO_DB_TABLE_NAME });

  const params: SignUpCommandInput = {
    ClientId: USER_POOL_CLIENT_ID, // @todo any possibility to use 'userPoolClient.id'?
    Username: email,
    Password: password,
    UserAttributes: [
      { 
        Name: 'email',
        Value: email,
      },
    ],
  };

  const command = new SignUpCommand(params);

  try {
    // Add user to cognito user pool
    const data = await clientCognito.send(command);
    console.log(data);

    // Create user in database
    const user = await clientDynamodb.create({
      pk: `${DBPrefix.User}${data.UserSub}`,
      sk: `${DBPrefix.User}${data.UserSub}`,
      email: email,
      handle: data.UserSub,
    });

    return new ApiResponse({
      statusCode: 201,
      body: data,
    })
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