import { APIGatewayEvent, Context } from "aws-lambda";
import { RestExceptionNoBody } from "errors";
import { CognitoIdentityProviderClient, SignUpCommand, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider";

/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
 const REGION = 'eu-central-1';
 const USER_POOL_CLIENT_ID = '15lv038tt2c5m7rp82mo9vdmjd';

export type SignupBody = {
  email: string;
  password: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw RestExceptionNoBody
  }
  
  const body: SignupBody = JSON.parse(event?.body);
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
  } catch (error) {
    // @todo add throw Error as return
    console.log('!!!ERROR!!!', error);
  } finally {
    // finally.
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      statusCode: 200,
      message: 'Successfully signed up'
    }),
  };
};