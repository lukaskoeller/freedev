import { AttributeValue, DynamoDBClient, GetItemCommand, GetItemCommandInput, InternalServerError, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../constants";
import { ApiErrorResponse, InternalErrorException } from "../utils";

export type DynamoDBServiceParams = {
  tableName: string;
  indexName?: string;
};

export class DynamoDBService {
  tableName: string;
  indexName?: string;

  constructor(parameters: DynamoDBServiceParams) {
    this.tableName = parameters.tableName;
    this.indexName = parameters.indexName;
  }

  // Create an Amazon DynamoDB service client object.
  client = new DynamoDBClient({ region: AWS_REGION });

  async create(item: Record<string, unknown>) {
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(item),
      // Avoid replace items with create
      ConditionExpression: 'attribute_not_exists(pk)',
    };

    try {
      const command = new PutItemCommand(params);
      const response = await this.client.send(command);
      console.log("Success - item added", response);
    } catch (error) {
      console.log("PutItemCommand Error", error.stack);
      throw InternalServerError;
    }
  }

  async read(item: { pk: string, sk: string }) {
    const params: GetItemCommandInput = {
      TableName: this.tableName,
      ...this.indexName ? { IndexName: this.indexName } : {},
      Key: marshall({
        pk: item.pk,
        sk: item.sk,
      }),
    };

    try {
      const command = new GetItemCommand(params);
      const response = await this.client.send(command);
      console.log("Success - item read", response);
    } catch (error) {
      console.log("GetItemCommand Error", error.stack);
      throw InternalServerError;
    }
  }
}