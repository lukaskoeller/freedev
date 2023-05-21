import { api } from "$lib/common/utils/api.utils";
import { getAccessToken } from "$lib/common/utils/auth.utils";
import { ALL_SKILLS_MAP } from "$lib/constants/skills";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const { accessToken: token } = await getAccessToken(cookies);
    const form = await request.formData();

    const language = form.getAll('languages');
    const technology = form.getAll('technologies');
    const tool = form.getAll('tools');

    const rawData = {
      language,
      technology,
      tool,
    };

    
    const data = Object.values(rawData).flat().map((item) => ALL_SKILLS_MAP[item as string]);
    
    const cleanData = data.map(({ name, category, subcategory }) => ({
      name,
      category,
      subcategory,
    }));

    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'user/skills',
      data: cleanData,
      token,
    });

    console.log(response);

    if (response.status === 200) {
      throw redirect(301, '/profile');
    }
  },
};