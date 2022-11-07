import { api } from '$lib/common/utils/api.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, request, fetch }) => {
  console.log({ request });
  const token = cookies.get('token');
  
  const response = await api({
    fetch,
    method: 'GET',
    resource: 'profile/lukas-koeller',
    token,
  });
  console.log({ response });
  const body = await response.json();

  return body;
}