import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const createDatabase = () => {
  const database = new aws.dynamodb.Table('main-dynamodb-table', {
    attributes: [
      {
        name: 'pk',
        type: 'S',
      },
      {
        name: 'sk',
        type: 'S',
      },
      {
        name: 'handle',
        type: 'S',
      },
      {
        name: 'gsi1pk',
        type: 'S',
      },
      {
        name: 'gsi1sk',
        type: 'S',
      },
      // Not indexed anywhere. Thus, not used.
      // (Not used in secondary index or similar).
      // {
      //   name: 'firstName',
      //   type: 'S',
      // },
      // {
      //   name: 'lastName',
      //   type: 'S',
      // },
    ],
    hashKey: 'pk',
    rangeKey: 'sk',
    globalSecondaryIndexes: [
      {
        name: "handle-index", // DYNAMO_DB_TABLE_NAME_INDEX
        projectionType: "ALL",
        hashKey: "handle",
        readCapacity: 1,
        writeCapacity: 1,
      },
      {
        name: "gsi1-index",
        projectionType: "ALL",
        hashKey: "gsi1pk",
        rangeKey: "gsi1sk",
        readCapacity: 1,
        writeCapacity: 1,
      },
    ],
    billingMode: 'PROVISIONED',
    // @todo Necessary to adjust?
    readCapacity: 1,
    writeCapacity: 1,
    tags: {
      Environment: pulumi.getStack(),
      Name: "main-dynamodb-table",
    },
    // @todo add `pointInTimeRecovery` for backups?
    // @todo `streamEnabled: true` to track added/updated/deleted events?
  });

  return database;
};