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
      'ALLOW_USER_PASSWORD_AUTH',
      'ALLOW_REFRESH_TOKEN_AUTH',
    ],
    preventUserExistenceErrors: 'ENABLED',
    /** Below, used for https://authjs.dev/reference/oauth-providers/cognito */
    generateSecret: true,
    supportedIdentityProviders: ["COGNITO"],
    allowedOauthFlowsUserPoolClient: true,
    allowedOauthFlows: ['code'],
    allowedOauthScopes: [
      'email',
      'openid',
      'profile',
    ],
    callbackUrls: [
      'https://freedev.app/auth/callback/cognito',
      'http://localhost:3000/auth/callback/cognito',
    ],
  });

  const userPoolEndpoint = userPool.endpoint;

  /** Domain needed for https://authjs.dev/reference/oauth-providers/cognito */
  const main = new aws.cognito.UserPoolDomain("main", {
    domain: "freedev",
    userPoolId: userPool.id,
  });

  return {
    userPoolClientId: userPoolClient.id,
    userPoolEndpoint,
    clientSecret: userPoolClient.clientSecret,
  }
}
