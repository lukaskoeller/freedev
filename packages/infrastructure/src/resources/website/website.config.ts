import * as pulumi from "@pulumi/pulumi";

/**
 * Load the Pulumi program configuration. These act as the "parameters" to the Pulumi program, so that different Pulumi Stacks can be brought up using the same code.
 */
const stackConfig = new pulumi.Config("web");

export type ConfigType = {
  pathToWebsiteContents: string;
  targetDomain: string;
  certificateArn: string | undefined;
  includeWWW: boolean;
}

export const config: ConfigType = {
    // pathToWebsiteContents is a relativepath to the website's contents.
    pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
    // targetDomain is the domain/host to serve content at.
    targetDomain: stackConfig.require("targetDomain"),
    // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.
    certificateArn: stackConfig.get("certificateArn"),
    // If true create an A record for the www subdomain of targetDomain pointing to the generated cloudfront distribution.
    // If a certificate was generated it will support this subdomain.
    // default: true
    includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
};
