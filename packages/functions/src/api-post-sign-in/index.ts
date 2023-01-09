import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { ApiErrorResponse, ApiResponse, InternalErrorException, NoBodyException } from "../common/utils";
import { AWS_REGION, USER_POOL_CLIENT_ID } from "@freedev/constants";

export type SignInBody = {
  email: string;
  password: string;
}

export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
  if (!event?.body) {
    throw NoBodyException;
  }

  const body: SignInBody = JSON.parse(event?.body);
  const { email, password } = body;
  const ipAddress = event?.['requestContext']?.['http']?.['sourceIp'];

  if (!ipAddress) {
    throw InternalErrorException;
  }
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

  const params: InitiateAuthCommandInput = {
    ClientId: USER_POOL_CLIENT_ID, // @todo any possibility to use 'userPoolClient.id'?
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    UserContextData: {
      IpAddress: ipAddress,
      // EncodedData
    },
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(params);
  try {
    const data = await client.send(command);
    console.log(data);

    return new ApiResponse({
      statusCode: 200,
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