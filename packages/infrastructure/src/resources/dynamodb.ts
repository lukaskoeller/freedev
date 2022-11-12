import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const createDatabase = () => {
  const database = new aws.dynamodb.Table('main-dynamodb-table', {
    attributes: [
      {
        name: 'username',
        type: 'S',
      },
      {
        name: 'email',
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
    hashKey: 'username',
    rangeKey: 'email',
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