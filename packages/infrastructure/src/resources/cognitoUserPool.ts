import * as aws from "@pulumi/aws";
import { emailConfiguration, emailIdentity } from "./emailConfig";

export const createUserPoolAndClient = () => {
  const userPool = new aws.cognito.UserPool('appPool', {
    accountRecoverySetting: {
      recoveryMechanisms: [
          {
              name: "verified_email",
              priority: 1,
          },
          {
              name: "verified_phone_number",
              priority: 2,
          },
      ],
    },
    usernameAttributes: ['phone_number', 'email'],
    emailConfiguration: {
      configurationSet: emailConfiguration.name,
      emailSendingAccount: 'DEVELOPER',
      fromEmailAddress: 'freedev <hey@freedev.app>',
      replyToEmailAddress: 'hey@freedev.app',
      sourceArn: emailIdentity.arn,
    },
    verificationMessageTemplate: {
      defaultEmailOption: 'CONFIRM_WITH_CODE',
      emailMessage: 'freedev says hello! Use {####} to confirm your sign up.',
      emailSubject: 'Verify your account with freedev',
    },
    deviceConfiguration: {
      deviceOnlyRememberedOnUserPrompt: true,
    },
    passwordPolicy: {
      minimumLength: 8,
      requireLowercase: true,
      requireSymbols: true,
      requireNumbers: true,
      requireUppercase: true,
    }
  });
  
  const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {
    userPoolId: userPool.id,
  });
}
