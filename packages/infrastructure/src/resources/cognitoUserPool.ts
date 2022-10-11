import * as aws from "@pulumi/aws";

export const createUserPoolAndClient = () => {
  const emailConfiguration = new aws.ses.ConfigurationSet("email-sign-up-verification", {
    // @todo re-enable?
    // deliveryOptions: {
    //     tlsPolicy: "Require",
    // },
    sendingEnabled: true,
    // trackingOptions @todo enable or not?
  });
  
  const emailConfigurationArn = emailConfiguration.arn;

  const emailIdentity = new aws.ses.EmailIdentity("hey-freedev-email-identity", {
    email: "hey@freedev.app",
  });
  
  const emailIdentity2 = new aws.ses.EmailIdentity("protonmail-email-identity", {
    email: "lukas.koeller@protonmail.com",
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
    emailConfiguration: {
      configurationSet: emailConfiguration.name,
      emailSendingAccount: 'DEVELOPER',
      // fromEmailAddress: 'freedev <hey@freedev.app>',
      replyToEmailAddress: 'lukas.koeller@protonmail.com',
      sourceArn: emailIdentity2.arn,
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

  return {
    userPoolClientId: userPoolClient.id,
  }
}
