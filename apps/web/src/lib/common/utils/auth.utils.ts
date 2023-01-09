import { decode } from "@auth/core/jwt";
import { COGNITO_CLIENT_SECRET } from "$env/static/private";
import { TOKEN_NAME } from "../constants";
import type { Cookies } from "@sveltejs/kit";

export const getAccessToken = async (cookies: Cookies) => {
  console.log({
    token: cookies.get(TOKEN_NAME),
    secret: COGNITO_CLIENT_SECRET,
  })
  return await decode({
    token: cookies.get(TOKEN_NAME),
    secret: COGNITO_CLIENT_SECRET,
  });
};