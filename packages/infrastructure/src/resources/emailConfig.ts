import * as aws from "@pulumi/aws";

export const emailConfiguration = new aws.ses.ConfigurationSet("email-sign-up-verification", {
  deliveryOptions: {
      tlsPolicy: "Require",
  },
  sendingEnabled: true,
  // trackingOptions @todo enable or not?
});

export const emailConfigurationArn = emailConfiguration.arn;

export const emailIdentity = new aws.ses.EmailIdentity("hey-freedev-email-identity", {
  email: "hey@freedev.app",
});
