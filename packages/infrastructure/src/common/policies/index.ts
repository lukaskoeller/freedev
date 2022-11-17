import * as aws from "@pulumi/aws";
import { DYNAMO_DB_TABLE_ARN } from "../../../../functions/src/common/constants";

export const policyReadWriteDynamodb = new aws.iam.Policy("iam-policy-read-write-dynamodb", {
  path: "/",
  description: "Provides read and write (excluding scan) access to DynamoDB and DynamoDB Streams",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "ReadWriteTable",
          "Effect": "Allow",
          "Action": [
              "dynamodb:BatchGetItem",
              "dynamodb:GetItem",
              "dynamodb:Query",
              // "dynamodb:Scan",
              "dynamodb:BatchWriteItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem"
          ],
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "GetStreamRecords",
          "Effect": "Allow",
          "Action": "dynamodb:GetRecords",
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "WriteLogStreamsAndGroups",
          "Effect": "Allow",
          "Action": [
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "CreateLogGroup",
          "Effect": "Allow",
          "Action": "logs:CreateLogGroup",
          "Resource": DYNAMO_DB_TABLE_ARN,
      }
    ]
  },
});

export const policyReadOnlyDynamodb = new aws.iam.Policy("iam-policy-read-only-dynamodb", {
  path: "/",
  description: "Provides read only access to DynamoDB and DynamoDB Streams",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "ReadWriteTable",
          "Effect": "Allow",
          "Action": [
              "dynamodb:BatchGetItem",
              "dynamodb:GetItem",
              "dynamodb:Query",
          ],
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "GetStreamRecords",
          "Effect": "Allow",
          "Action": "dynamodb:GetRecords",
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "WriteLogStreamsAndGroups",
          "Effect": "Allow",
          "Action": [
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Resource": DYNAMO_DB_TABLE_ARN,
      },
      {
          "Sid": "CreateLogGroup",
          "Effect": "Allow",
          "Action": "logs:CreateLogGroup",
          "Resource": DYNAMO_DB_TABLE_ARN,
      }
    ]
  },
});