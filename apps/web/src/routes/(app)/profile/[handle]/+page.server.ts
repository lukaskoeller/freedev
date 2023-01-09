import { TOKEN_NAME } from '$lib/common/constants';
import { api } from '$lib/common/utils/api.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, request, fetch, params }) => {
  console.log({ request });
  const handle = params.handle;
  const token = cookies.get(TOKEN_NAME);
  
  const response = await api({
    fetch,
    method: 'GET',
    resource: `user/${handle}`,
    token,
  });
  const body = await response.json();

  return body;
}