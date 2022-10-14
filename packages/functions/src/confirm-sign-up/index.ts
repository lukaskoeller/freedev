import { APIGatewayEvent, Context } from "aws-lambda";
import { RestExceptionNoBody } from "errors";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";

/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
const REGION = 'eu-central-1';
const USER_POOL_CLIENT_ID = '6b3h1osi597ifm5at8qcsavg5d';

// @todo use for body schema validation https://github.com/colinhacks/zod
export type ConfirmSignUpBody = {
  confirmationCode: string;
  username: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw RestExceptionNoBody
  }
  
  const body: ConfirmSignUpBody = JSON.parse(event?.body);
  const { confirmationCode, username } = body;
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: REGION });

  const params: ConfirmSignUpCommandInput = {
    ConfirmationCode: confirmationCode,
    ClientId: USER_POOL_CLIENT_ID,
    Username: username,
  };

  const command = new ConfirmSignUpCommand(params);

  try {
    const data = await client.send(command);
    console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        message: 'Successfully confirmed user',
        data,
      }),
    };
  } catch (error) {
    // @todo add throw Error as return
    console.log('!!!ERROR!!!', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        message: 'Something went wrong when confirming this user',
      }),
    }
  } finally {
    // finally.
  }
};