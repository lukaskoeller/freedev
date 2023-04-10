import { type DefaultUser } from "@auth/core/types";
import { InitiateAuthResponse } from "@aws-sdk/client-cognito-identity-provider";


// @todo NEXT
// @url https://authjs.dev/reference/core/modules/types
declare module "@auth/core/type" {
  interface User extends InitiateAuthResponse {}
  interface Session {
    user: User;
  }
}