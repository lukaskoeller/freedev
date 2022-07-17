import { APIGatewayEvent, Context } from "aws-lambda";
import { RestExceptionNoBody } from "errors";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
 const REGION = 'eu-central-1';

export type SignupBody = {
  email: string;
  password: string;
}

async (event: APIGatewayEvent, context: Context) => {
  // const user = new User()
  console.log('LOG:LOG:LOG:LOG', {
    event,
    context,
  });
  if (!event?.body) {
    throw RestExceptionNoBody
  }
  console.log('BODY!!!', event?.body);
  
  const body: SignupBody = JSON.parse(event?.body);
  const { email, password } = body;
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: REGION });

  const params = {
    ClientId: 'xyz', // userPoolClient.id
    Username: email,
    Password: password,
  };

  const command = new SignUpCommand(params);
  
  // async/await.
  try {
    const data = await client.send(command);
    // process data.
  } catch (error) {
    // error handling.
  } finally {
    // finally.
  }
  
  return {
    statusCode: 200,
    body: "Hello, API Gateway!",
  };
};