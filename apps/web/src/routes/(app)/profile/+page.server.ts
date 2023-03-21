import { api } from '$lib/common/utils/api.utils';
import { getAccessToken } from '$lib/common/utils/auth.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, request, fetch }) => {

  const authToken = await getAccessToken(cookies);
  console.log(authToken);
  
  
  const response = await api({
    fetch,
    method: 'GET',
    resource: 'user',
    token: authToken?.accessToken,
  });
  const body = await response.json();
  console.log({ body });

  return body;
}