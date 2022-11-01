import * as aws from "@pulumi/aws";

export const passwordPolicy = {
  minimumLength: 8,
  requireLowercase: true,
  requireSymbols: true,
  requireNumbers: true,
  requireUppercase: true,
};

export const createUserPoolAndClient = () => {
  const emailConfiguration = new aws.ses.ConfigurationSet("email-sign-up-verification", {
    // @todo re-enable "Require"?
    deliveryOptions: {
        tlsPolicy: "Optional",
    },
    sendingEnabled: true,
    // trackingOptions @todo enable or not?
  });
  
  const emailConfigurationArn = emailConfiguration.arn;

  const emailIdentity = new aws.ses.EmailIdentity("hey-freedev-email-identity", {
    email: "hey@freedev.app",
  });

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
    autoVerifiedAttributes: ['email'],
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
    passwordPolicy,
  });
  
  const userPoolClient = new aws.cognito.UserPoolClient("appPoolClient", {
    userPoolId: userPool.id,
    explicitAuthFlows: [
      'ALLOW_REFRESH_TOKEN_AUTH',
      'ALLOW_CUSTOM_AUTH',
      'ALLOW_USER_SRP_AUTH',
      'USER_PASSWORD_AUTH',
    ],
    preventUserExistenceErrors: 'ENABLED',
  });

  const userPoolEndpoint = userPool.endpoint;

  return {
    userPoolClientId: userPoolClient.id,
    userPoolEndpoint,
  }
}
