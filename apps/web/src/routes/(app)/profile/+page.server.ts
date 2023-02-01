import { api } from '$lib/common/utils/api.utils';
import { getAccessToken } from '$lib/common/utils/auth.utils';
import type { PageServerLoad } from './$types';
// import { getToken } from '@auth/core/jwt';

export const load: PageServerLoad = async ({ cookies, request, fetch }) => {

  const { accessToken: token } = await getAccessToken(cookies);
  // @see https://github.com/nextauthjs/next-auth/discussions/5595#discussioncomment-4651584
  // @see https://authjs.dev/guides/basics/securing-pages-and-api-routes#using-gettoken
  // const token = await getToken({
  //   req: request,
  //   secret: COGNITO_CLIENT_SECRET,
  // })
  
  const response = await api({
    fetch,
    method: 'GET',
    resource: 'user',
    token,
  });
  const body = await response.json();
  

  return body;
}