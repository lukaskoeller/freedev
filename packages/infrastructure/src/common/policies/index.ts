import * as aws from "@pulumi/aws";
import {
  DYNAMO_DB_TABLE_ARN,
  GITHUB_ACTIONS_ROLE_TO_ASSUME,
  ROLE_SESSION_NAME,
  STACK_NAME,
  AWS_ACCOUNT_ID,
} from "@freedev/constants";

/**
 * More information:
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-specific-table-indexes.html
 */
export const policyWriteDynamodb = new aws.iam.Policy("iam-policy-write-dynamodb", {
  path: "/",
  description: "Provides write access to DynamoDB and DynamoDB Streams",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "ReadWriteTable",
          "Effect": "Allow",
          "Action": [
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
          "Sid": "ReadTable",
          "Effect": "Allow",
          "Action": [
              "dynamodb:BatchGetItem",
              "dynamodb:GetItem",
              "dynamodb:Query",
          ],
          "Resource": [
            DYNAMO_DB_TABLE_ARN,
            `${DYNAMO_DB_TABLE_ARN}/index/*`,
          ]
      },
      {
          "Sid": "GetStreamRecords",
          "Effect": "Allow",
          "Action": "dynamodb:GetRecords",
          "Resource": [
            DYNAMO_DB_TABLE_ARN,
            `${DYNAMO_DB_TABLE_ARN}/index/*`,
          ]
      },
      {
          "Sid": "WriteLogStreamsAndGroups",
          "Effect": "Allow",
          "Action": [
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Resource": [
            DYNAMO_DB_TABLE_ARN,
            `${DYNAMO_DB_TABLE_ARN}/index/*`,
          ]
      },
      {
          "Sid": "CreateLogGroup",
          "Effect": "Allow",
          "Action": "logs:CreateLogGroup",
          "Resource": [
            DYNAMO_DB_TABLE_ARN,
            `${DYNAMO_DB_TABLE_ARN}/index/*`,
          ]
      }
    ]
  },
});

// @todo Is it actually needed? if not delete, this and all usage
export const policyGithubAssumeRoleWithWebIdentity = new aws.iam.Policy("iam-policy-github-assume-role-with-web-identity", {
  path: "/",
  description: "Provides access to web identity for GitHub Actions",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
        {
          "Sid": "RoleForGitHubActions",
          "Effect": "Allow",
          "Action": [
            "sts:AssumeRoleWithWebIdentity"
          ],
          "Resource": `arn:aws:iam::${AWS_ACCOUNT_ID}:role/GitHubActionRole`
        }
    ]
  },
});

export const policyCloudformationDefineStacks = new aws.iam.Policy('iam-policy-cloudformation-describe-stacks', {
  path: "/",
  description: "Provides access to describe cloudformation stacks",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AllowDescribeStacks",
        "Effect": "Allow",
        "Action": [
          "cloudformation:DescribeStacks"
        ],
        "Resource": [
          `arn:aws:cloudformation:eu-central-1:${AWS_ACCOUNT_ID}:stack/*/*`, // or stack/STACK_NAME/*
          `arn:aws:sts::${AWS_ACCOUNT_ID}:assumed-role/${GITHUB_ACTIONS_ROLE_TO_ASSUME}/${ROLE_SESSION_NAME}`
        ]
      }
    ]
  },  
})

export const policyGetSsmParameter = new aws.iam.Policy('iam-policy-get-ssm-parameter', {
  path: "/",
  description: "Provides capability to get SSM parameter",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "AllowSSMGetParameter",
          "Effect": "Allow",
          "Action": [
              "ssm:GetParameter"
          ],
          "Resource": [
              `arn:aws:ssm:eu-central-1:${AWS_ACCOUNT_ID}:parameter/cdk-bootstrap/hnb659fds/version`
          ]
      }
    ]
  }
});