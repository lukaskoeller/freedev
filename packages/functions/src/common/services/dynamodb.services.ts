import { AttributeValue, DynamoDBClient, InternalServerError, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../constants";
import { ApiErrorResponse, InternalErrorException } from "../utils";

export type DynamoDBServiceParams = {
  tableName: string;
};

export class DynamoDBService {
  tableName: string;

  constructor(parameters: DynamoDBServiceParams) {
    this.tableName = parameters.tableName; 
  }

  // Create an Amazon DynamoDB service client object.
  client = new DynamoDBClient({ region: AWS_REGION });

  async create(item: Record<string, unknown>) {
    const params = {
      TableName: this.tableName,
      Item: marshall(item),
    };

    try {
      const command = new PutItemCommand(params);
      const response = await this.client.send(command);
      console.log("Success - item added or updated", response);
    } catch (error) {
      console.log("PutItemCommand Error", error.stack);
      throw InternalServerError;
    }
  }
}