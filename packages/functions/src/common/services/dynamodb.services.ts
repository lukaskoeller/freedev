import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  InternalServerError,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../constants";
import { Item } from "../modules/base.entities";

let client: DynamoDBClient;

export const getClient = (): DynamoDBClient => {
    if (client) return client;

    client = new DynamoDBClient({
      region: AWS_REGION,
    })
    return client;
};

// @todo NEXT how to get generic class?
export type Constructor<T> = new (...args: any[]) => T;

export type ReadItem = {
  /**
   * Partition Key (Hash Key)
   */
  pk: string,
  /**
   * Sort Key (Range Key)
   * Required when DynamoDB Client did not
   * provide `indexName`.
   */
  sk?: string,
}

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

  // Get an Amazon DynamoDB service client object.
  client = getClient();

  async create<T extends Record<string, unknown>>(item: T) {
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(item, {
        removeUndefinedValues: true,
      }),
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

  // @todo Better solution for conditional adding object props?
  async read(item: ReadItem) {
    const params: GetItemCommandInput = {
      TableName: this.tableName,
      ...this.indexName ? { IndexName: this.indexName } : {},
      Key: marshall({
        pk: item.pk,
        ...item?.sk ? { sk: item.sk } : {},
      }),
    };

    try {
      const command = new GetItemCommand(params);
      const response = await this.client.send(command);
      console.log("Success - item read", response);
      const item = response.Item;
      if (item === undefined) {
        return undefined;
      }
      return unmarshall(item);

    } catch (error) {
      console.log("GetItemCommand Error", error.stack);
      throw InternalServerError;
    }
  }
}