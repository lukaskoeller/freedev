import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  InternalServerError,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "@freedev/constants";
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
   */
  sk: string,
}
export type UpdateItem = {
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
      Item: marshall(
        item, 
        { removeUndefinedValues: true }
      ),
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

  async createBatch<T extends Record<string, unknown>[]>(items: T) {
    const params: BatchWriteCommandInput = {
      RequestItems: {
        [this.tableName]: items.map(item => {
          return {
            PutRequest: { Item: unmarshall(marshall(
              item, 
              { removeUndefinedValues: true }
            )) }
          };
        })
      }
    };

    try {
      const command = new BatchWriteCommand(params);
      const response = await this.client.send(command);
      console.log("Success - items added", response);
    } catch (error) {
      console.log("BatchWriteCommand Error", error.stack);
      throw InternalServerError;
    }
  }

  // @todo Better solution for conditional adding object props?
  async read(item: Record<string, unknown>) {
    if (this?.indexName) {
      const entries = Object.entries(item);
      const [[key, value]] = entries;
      const params: QueryCommandInput = {
        TableName: this.tableName,
        IndexName: this.indexName,
        ...entries.length === 1
          ? {
            KeyConditionExpression: `#${key} = :${key}`,
            ExpressionAttributeNames: {
                [`#${key}`]: key
            },
            ExpressionAttributeValues: {
                [`:${key}`]: marshall(value)
            }
          } : item,
      };
      console.log('params', params);
      

      try {
        const command = new QueryCommand(params);
        const response = await this.client.send(command);
        console.log("Success - items read", response);
        const items = response?.Items;
        if (items === undefined) {
          return undefined;
        }
        if (items.length === 1) {
          return unmarshall(items[0]);
        }
        return items.map((item) => unmarshall(item));
  
      } catch (error) {
        console.log("QueryCommand Error", error.stack);
        throw InternalServerError;
      }
    }

    const params: GetItemCommandInput = {
      TableName: this.tableName,
      Key: marshall({
        pk: item.pk,
        sk: item.sk,
      }),
    };
    console.log('params', params);

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

  async update(item: UpdateItem & Record<string, unknown>) {
    const { pk, sk, ...input } = item;
    const itemKeys = Object.keys(input);
    const params: UpdateItemCommandInput = {
      TableName: this.tableName,
      ...this.indexName ? { IndexName: this.indexName } : {},
      Key: marshall({
        pk,
        ...sk ? { sk } : {},
      }),
      ConditionExpression: "attribute_exists(pk)",
      UpdateExpression: `SET ${itemKeys.map((_k, index) => `#field${index} = :value${index}`)
      .join(', ')}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, a, index) => ({
            ...accumulator,
            [`#field${index}`]: a,
        }),
        {},
      ),
      ExpressionAttributeValues: marshall(
        itemKeys.reduce(
            (accumulator, b, index) => ({
                ...accumulator,
                [`:value${index}`]: item[b],
            }),
            {},
        ), { removeUndefinedValues: true }
      ),
    };

    try {
      const command = new UpdateItemCommand(params);
      const response = await this.client.send(command);
      console.log("Success - item updated", response);
    } catch (error) {
      console.log("UpdateItemCommand Error", error.stack);
      throw InternalServerError;
    }
  }
}