import { decode } from "@auth/core/jwt";
import { AUTH_SECRET } from "$env/static/private";
import { TOKEN_NAME } from "../constants";
import type { Cookies } from "@sveltejs/kit";

export const getAccessToken = async (cookies: Cookies, raw = false) => {
  const token = cookies.get(TOKEN_NAME); // TOKEN_NAME = "next-auth.session-token"
  if (raw) return token;
  return await decode({
    token,
    secret: AUTH_SECRET,
  });
};