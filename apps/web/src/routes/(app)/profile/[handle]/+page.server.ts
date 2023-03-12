import { api } from '$lib/common/utils/api.utils';
import { getAccessToken } from '$lib/common/utils/auth.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, request, fetch }) => {

  const { accessToken: token } = await getAccessToken(cookies);

  const response = await api({
    fetch,
    method: 'GET',
    resource: 'user',
    token,
  });
  const body = await response.json();

  const { skills } = body;
  const skillsByCategory = skills.reduce((acc, cur) => {
    const category = cur.category;
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(cur);
    return acc;
}, {});

  return {
    ...body,
    skills: skillsByCategory,
  };
}