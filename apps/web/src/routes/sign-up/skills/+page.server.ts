import { getAccessToken } from "$lib/common/utils/auth.utils";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const { accessToken: token } = await getAccessToken(cookies);
    const form = await request.formData();
    console.log(form);

    const languages = form.getAll('languages');
    const technologies = form.getAll('technologies');
    const tools = form.getAll('tools');

    const data = {
      languages,
      technologies,
      tools,
    };

    console.log(data);

    // @todo TEMPORARY Remove
    // throw redirect(301, '/profile');
  },
};