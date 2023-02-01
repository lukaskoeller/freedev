import { api } from '$lib/common/utils/api.utils';
import { getAccessToken } from '$lib/common/utils/auth.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, request, fetch }) => {

  const { accessToken: token } = await getAccessToken(cookies);
  console.log({ token });
  
  
  const response = await api({
    fetch,
    method: 'GET',
    resource: 'user',
    token,
  });
  const body = await response.json();
  console.log({ body });

  return body;
}