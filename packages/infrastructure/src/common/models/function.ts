import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface LambdaFunctionArgs {
  /**
   * The region the certicate should be registered.
   */
  region?: aws.Provider;
  /**
   * Policy that grants an entity permission to assume the role.
   */
  assumeRolePolicy: pulumi.Input<string | aws.iam.PolicyDocument>;
  /**
   * The ARN of the policy you want to apply.
   */
  policyArn: pulumi.Input<string>;
  /**
   * Path to the function's deployment package within the local filesystem. Conflicts with `imageUri`, `s3Bucket`, `s3Key`, and `s3ObjectVersion`.
   */
  code: pulumi.Input<pulumi.asset.Archive> | undefined;
  /**
   * Function entrypoint in your code.
   */
  handler: pulumi.Input<string> | undefined;
  publish?: boolean;
}

// @todo NEXT abstract values from props (assumRolePolicy etc.)
export class LambdaFunction extends pulumi.ComponentResource {
  iamRole: aws.iam.Role;
  rolePolicy: aws.iam.RolePolicyAttachment;
  function: aws.lambda.Function;
  version: pulumi.Output<string>;
  arn: pulumi.Output<string>;
  arnVersion: pulumi.Output<string>;
  
  constructor(name: string, args: LambdaFunctionArgs, opts?: pulumi.ComponentResourceOptions) {
      super("freedev:index:LambdaFunction", name, {}, opts);

      this.iamRole = new aws.iam.Role(`${name}-lambda-iam-role`, {
        assumeRolePolicy: args.assumeRolePolicy,
      }, { parent: this });

      this.rolePolicy = new aws.iam.RolePolicyAttachment(`${name}-lambda-role-attachment`, {
        role: this.iamRole,
        policyArn: args.policyArn,
      }, { parent: this });

      this.function = new aws.lambda.Function(`${name}-lambda`, {
        code: args.code,
        role: this.iamRole.arn,
        handler: args.handler,
        runtime: "nodejs16.x",
        publish: args?.publish ?? false,
      }, {
        // Some resources _must_ be put in us-east-1, such as Lambda at Edge.
        ...args?.region ? { provider: args.region } : {},
        parent: this,
      });

      // Every change in the lambda triggers a lambda version bump.
      this.version = this.function.version;

      // Not using qualifiedArn here due to some bugs around sometimes returning $LATEST
      this.arnVersion = pulumi.interpolate`${this.function.arn}:${this.version}`;

      this.arn = this.function.arn;

      // Register output properties for this component
      this.registerOutputs({
        iamRole: this.iamRole,
        rolePolicy: this.rolePolicy,
        function: this.function,
        version: this.version,
        arnVersion: this.arnVersion,
        arn: this.function.arn,
      });
  }
}