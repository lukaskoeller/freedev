import { api } from "$lib/common/utils/api.utils";
import { dev } from '$app/environment';
import { invalid, type Cookies } from "@sveltejs/kit";

export type NewDeviceMetadata = {
  DeviceGroupKey: string;
  DeviceKey: string;
}

export type AuthenticationResult = {
  AccessToken: string;
  ExpiresIn: number;
  IdToken: string;
  NewDeviceMetadata: NewDeviceMetadata,
  RefreshToken: string;
  TokenType: string;
};

export const signInServer = async (
  request: Request,
  cookies: Cookies
) => {
  const form = await request.formData();
    console.log('FORM', form);

    const email = form.get('email');
    const password = form.get('password');
  
    const response = await api({
      fetch,
      method: 'POST',
      resource: 'sign-in',
      data: {
        email,
        password,
      },
    });
    const body = await response.json();

    console.log({
      response,
      body,
    });

    if (body?.statusCode === 500) {
      return invalid(500, { message: body?.message });
    }

    if (body?.statusCode === 400) {
      return invalid(400, { message: body?.message });
    }

    const authResult = body.AuthenticationResult as AuthenticationResult;

    cookies.set('token', authResult.AccessToken, {
      // send cookie for every page
      path: '/',
      // server side only cookie so you can't use `document.cookie`
      httpOnly: true,
      // only requests from same site can send cookies
      // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
      sameSite: 'strict',
      // only sent over HTTPS in production
      // @todo use different variable? see https://vitejs.dev/guide/env-and-mode.html
      secure: !dev,
      // set cookie to expire after a month
      maxAge: authResult.ExpiresIn,
    });
}