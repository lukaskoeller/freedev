import { SvelteKitAuth } from "@auth/sveltekit";
import CognitoProvider from '@auth/core/providers/cognito';
// import CredentialsProvider from '@auth/core/providers/credentials';
import type { Handle } from '@sveltejs/kit';
// import { api } from "$lib/common/utils/api.utils";
import type { Profile } from "@auth/core/types";
import type { Provider } from "@auth/core/providers";
import { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER } from "$env/static/private";
import { sequence } from "@sveltejs/kit/hooks";

export type TCredentials = {
  email: string;
  password: string;
}

const auth = SvelteKitAuth({
  providers: [
    // CredentialsProvider({
    //   async authorize(credentials: TCredentials, request) {
    //     const response = await api({
    //       fetch,
    //       method: 'POST',
    //       resource: 'sign-in',
    //       data: credentials,
    //     });
    //     const body = await response.json();
    //     if (!response.ok) return null;
    //     return body ?? null;
    //   },
    //   id: 'credentials',
    // }) as Provider<Profile>,
    CognitoProvider({
      clientId: COGNITO_CLIENT_ID,
      clientSecret: COGNITO_CLIENT_SECRET,
      issuer: COGNITO_ISSUER,
    }) as Provider<Profile>,
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
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

const base = async ({ event, resolve }) => {
  

  const response = await resolve(event);
  return response;
};

export const handle: Handle = sequence(auth, base)
