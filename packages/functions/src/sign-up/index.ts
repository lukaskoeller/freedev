import { APIGatewayEvent, Context } from "aws-lambda";
import { RestExceptionNoBody } from "errors";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";

/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
const REGION = 'eu-central-1';
const USER_POOL_CLIENT_ID = '6b3h1osi597ifm5at8qcsavg5d';

export type SignUpBody = {
  email: string;
  password: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw RestExceptionNoBody
  }
  
  const body: SignUpBody = JSON.parse(event?.body);
  const { email, password } = body;
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: REGION });

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

    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        message: 'Successfully signed up',
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
        message: 'Something went wrong when signing up this user',
      }),
    }
  } finally {
    // finally.
  }
};