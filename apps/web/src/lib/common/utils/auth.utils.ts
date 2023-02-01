import { decode } from "@auth/core/jwt";
import { AUTH_SECRET } from "$env/static/private";
import { TOKEN_NAME } from "../constants";
import type { Cookies } from "@sveltejs/kit";

/**
 * @see https://authjs.dev/reference/sveltekit/modules/main#usage
 * @see https://github.com/nextauthjs/next-auth/discussions/5595#discussioncomment-4651584
 * @see https://github.com/xmlking/svelte-starter-kit/blob/main/src/lib/server/middleware/authjs-helper.ts
 */
export const getAccessToken = async (cookies: Cookies, raw = false) => {
  const token = cookies.get(TOKEN_NAME); // TOKEN_NAME = "next-auth.session-token"
  if (raw) return token;
  return await decode({
    token,
    secret: AUTH_SECRET,
  });
};

// @todo
// @see https://github.com/nextauthjs/next-auth/discussions/5595#discussioncomment-4651584
// @see https://authjs.dev/guides/basics/securing-pages-and-api-routes#using-gettoken
// import { getToken } from '@auth/core/jwt';
// const token = await getToken({
//   req: request,
//   secret: COGNITO_CLIENT_SECRET,
// })