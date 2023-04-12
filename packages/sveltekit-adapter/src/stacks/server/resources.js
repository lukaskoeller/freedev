import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { NameRegister } from '../utils'

const nameRegister = NameRegister.getInstance()

/**
 * 
 * @param {string} name 
 * @returns {string}
 */
let registerName = (name) => nameRegister.registerName(name);

/**
 * Gets an AWS IAM role for use with Lambda functions.
 * @function
 * @returns {aws.iam.Role}
 */
export function getLambdaRole() {
  const iamForLambda = new aws.iam.Role(registerName('IamForLambda'), {
    assumeRolePolicy: `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Principal": {
                "Service": [
                  "lambda.amazonaws.com"
                ]
              },
              "Effect": "Allow",
              "Sid": ""
            }
          ]
        }
        `,
  })

  const RPA = new aws.iam.RolePolicyAttachment(
    registerName('ServerRPABasicExecutionRole'),
    {
      role: iamForLambda.name,
      policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }
  )

  return iamForLambda
}

/**
 * Builds an AWS Lambda function.
 * @function
 * @param {string} name - The name of the Lambda function.
 * @param {aws.iam.Role} iamForLambda - The IAM role for the Lambda function.
 * @param {string} codePath - The path to the code for the Lambda function.
 * @param {object} [environment = {}] - The environment variables for the Lambda function.
 * @param {number} [memorySize = 128] - The memory size for the Lambda function.
 * @returns {aws.lambda.FunctionUrl}
 */
export function buildLambda(
  name,
  iamForLambda,
  codePath,
  environment,
  memorySize,
) {
  const lambdaHandler = new aws.lambda.Function(registerName(name), {
    code: new pulumi.asset.FileArchive(codePath),
    role: iamForLambda.arn,
    handler: 'index.handler',
    runtime: 'nodejs18.x',
    timeout: 900,
    memorySize: memorySize,
    environment: {
      variables: {
        ...environment,
      },
    },
  })

  const lambdaURL = new aws.lambda.FunctionUrl(`${name}URL`, {
    functionName: lambdaHandler.arn,
    authorizationType: 'NONE',
  })

  return lambdaURL
}
