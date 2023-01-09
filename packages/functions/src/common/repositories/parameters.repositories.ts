// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametercommand.html#input

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { INTERNAL_ERROR_MESSAGE } from "errors";
import { AWS_REGION } from "@freedev/constants";
import { ApiErrorResponse, InternalErrorException } from "../utils";

/**
 * Get information about a single parameter by specifying the parameter name.
 * @param {GetParameterCommandInput['Name']} name The name of the parameter you want to query.
 * To query by parameter label, use `"Name": "name:label"`. To query by parameter
 * version, use `"Name": "name:version"`.
 * 
 * @note NOT IN USE AT THE MOMENT
 */
export const getParameterByName = async (name: string) => {
  if (!name) {
    throw new ApiErrorResponse({
      statusCode: 500,
      body: {
        status: 500,
        message: INTERNAL_ERROR_MESSAGE,
        debugMessage: 'A `name` is missing as argument.',
      }
    })
  }
  const config = {
    region: AWS_REGION, 
  }
  
  const input = {
    Name: name,
  }
  try {
    const client = new SSMClient(config);
    const command = new GetParameterCommand(input);
    const response = await client.send(command);
  
    return response;
 
  } catch (error) {
    throw InternalErrorException;
  }
};
