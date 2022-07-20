import { APIGatewayEvent, Context } from "aws-lambda";
import { RestExceptionNoBody } from "errors";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
// import { userPoolClient } from "infrastructure";

/**
 * AWS Region
 * @see https://www.pulumi.com/registry/packages/aws/api-docs/getregion/
 */
 const REGION = 'eu-central-1';
 const USER_POOL_CLIENT_ID = '2nn02h56mp8aa9ckj89b2m9mi1';

export type SignupBody = {
  email: string;
  password: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  // const user = new User()
  console.log('!!!LOG!!!', {
    event,
    context,
  });
  if (!event?.body) {
    throw RestExceptionNoBody
  }
  console.log('!!!BODY!!!', event?.body);
  
  const body: SignupBody = JSON.parse(event?.body);
  const { email, password } = body;
  
  // a client can be shared by different commands.
  const client = new CognitoIdentityProviderClient({ region: REGION });

  const params = {
    ClientId: USER_POOL_CLIENT_ID, // @todo any possibility to use 'userPoolClient.id'?
    Username: email,
    Password: password,
  };

  const command = new SignUpCommand(params);
  
  // async/await.
  try {
    console.log('TRY:CLIENT_SEND');
    const data = await client.send(command);
    console.log('DATA: ', data);
    
    // process data.
  } catch (error) {
    console.log('!!!ERROR!!!');
    // error handling.
  } finally {
    console.log('!!!FINALLY!!!');
    // finally.
  }
  
  return {
    statusCode: 200,
    body: "Hello, API Gateway!",
  };
};