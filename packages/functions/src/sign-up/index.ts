import { APIGatewayEvent, APIGatewayProxyEventV2, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import { ApiErrorResponse, ApiResponse, BodyErrorType, NoBodyException } from "../common/utils";
import { AWS_REGION, USER_POOL_CLIENT_ID } from "../common/constants";

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
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

  const params: SignUpCommandInput = {
    ClientId: USER_POOL_CLIENT_ID, // @todo any possibility to use 'userPoolClient.id'?
    Username: email,
    Password: password,
    UserAttributes: [
      { 
        Name: 'email',
        Value: email,
     }
    ],
  };

  const command = new SignUpCommand(params);

  try {
    const data = await client.send(command);
    console.log(data);

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