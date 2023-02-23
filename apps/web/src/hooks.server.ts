import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from '@auth/core/providers/credentials';
import type { Handle } from '@sveltejs/kit';
import type { Profile } from "@auth/core/types";
import type { Provider } from "@auth/core/providers";
// @todo remove all CognitoProvider stuff if Credentials work
// import { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER } from "$env/static/private";
import { api } from "$lib/common/utils/api.utils";

export type TCredentials = {
  username: string;
  password: string;
}

const auth = SvelteKitAuth({
  providers: [
    // https://next-auth.js.org/configuration/providers/credentials
    CredentialsProvider({
      credentials: {
        username: { label: "E-Mail", type: "email", placeholder: "jsmith@proton.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials: TCredentials) {
        const response = await api({
          fetch,
          method: 'POST',
          resource: 'sign-in',
          data: {
            email: credentials.username,
            password: credentials.password,
          },
        });
        const body = await response.json();
        
        if (!response.ok) return null;
        return body ?? null;
      },
      id: 'credentials',
    }) as Provider<Profile>,
    // CognitoProvider({
    //   clientId: COGNITO_CLIENT_ID,
    //   clientSecret: COGNITO_CLIENT_SECRET,
    //   issuer: COGNITO_ISSUER,
    // }) as Provider<Profile>,
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      // @todo do proper handling of user from credentialsProvider
      if (user?.AuthenticationResult?.AccessToken) {
        token.accessToken = user?.AuthenticationResult?.AccessToken
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      
      session.accessToken = token.accessToken
      return session;
    }
  },
  
});

// const base = async ({ event, resolve }) => {
  

//   const response = await resolve(event);
//   return response;
// };

export const handle: Handle = auth;
