import { api } from "$lib/common/utils/api.utils";
import { getAccessToken } from "$lib/common/utils/auth.utils";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const { accessToken: token } = await getAccessToken(cookies);
    const form = await request.formData();
    console.log(form);

    const language = form.getAll('languages');
    const technology = form.getAll('technologies');
    const tool = form.getAll('tools');

    const rawData = {
      language,
      technology,
      tool,
    };

    const data = Object.entries(rawData).flatMap(([key, value]) => {
      return Array.isArray(value)
        ? value.map((val: string) => ({
          category: key,
          skill: val,
        })) : ({
          category: key,
          skill: value,
        })
    });

    console.log(data);
    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'user/skills',
      data,
      token,
    });

    if (response.status === 200) {
      throw redirect(301, '/profile');
    }
  },
};