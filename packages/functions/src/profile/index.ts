import { APIGatewayEvent, Context } from "aws-lambda";
import { DEFAULT_ERROR_MESSAGE } from "errors";
import { ApiErrorResponse, ApiResponse } from "../utils";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  
  // @todo add handler code for profile fetching (DynamoDB etc)

  try {
    console.log({ event, context });
    console.log('!!!/profile/{profileName}');
    console.log(event?.['pathParameters']?.['profileName']);

    return new ApiResponse({
      statusCode: 200,
      body: { message: 'Your profile is in progress...' },
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