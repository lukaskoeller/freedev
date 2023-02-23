import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import { ApiErrorResponse, ApiResponse, NoBodyException, SchemaException } from "../common/utils";
import { DYNAMO_DB_TABLE_NAME, USER_POOL_CLIENT_ID, USER_POOL_ID } from "@freedev/constants";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { z } from "zod";
import { DynamoDBService } from "../common/services/dynamodb.services";
import { Skill } from "../common/modules/skill/skill.entities";

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: USER_POOL_CLIENT_ID,
});

const bodySchema = z.array(
  z.object({
    skill: z.string(),
    category: z.string(),
    proficiency: z.number().optional(),
  })
)

export const handler = async (event: APIGatewayEvent, context: Context) => {
  if (!event?.body) {
    throw NoBodyException;
  }

  console.log('EVENT:BODY', event.body);
  const body = JSON.parse(event.body);

  try {
    bodySchema.parse(body);
  } catch (error) {
    return SchemaException(error); 
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
  const skills = body.map(({ skill, category, proficiency }) => new Skill({
    skill,
    category,
    proficiency,
    username,
  }).toItem());
  console.log('SKILLS', skills);
  
  const clientDynamodb = new DynamoDBService({ tableName: DYNAMO_DB_TABLE_NAME });

  const input = skills;

  try {
    const data = await clientDynamodb.createBatch(input);
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