import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import { ApiErrorResponse, ApiResponse, NoBodyException } from "../common/utils";
import { AWS_REGION, USER_POOL_CLIENT_ID } from "@freedev/constants";

// @todo use for body schema validation https://github.com/colinhacks/zod
export type ConfirmSignUpBody = {
  confirmationCode: string;
  username: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw NoBodyException;
  }
  
  const body: ConfirmSignUpBody = JSON.parse(event?.body);
  const { confirmationCode, username } = body;
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

  const params: ConfirmSignUpCommandInput = {
    ConfirmationCode: confirmationCode,
    ClientId: USER_POOL_CLIENT_ID,
    Username: username,
  };

  const command = new ConfirmSignUpCommand(params);

  try {
    const data = await client.send(command);
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