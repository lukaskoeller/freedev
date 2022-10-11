import type { Actions } from "@sveltejs/kit";
import { api } from "./_api";

export const actions: Actions = {
  signup: async ({ request, cookies }) => {
    console.log('request', request);
    
    const form = await request.formData();

    const response = await api('PUT', 'sign-up', {
      email: form.get('email'),
      password: form.get('password'),
    });
    const body = await response.json();
    console.log('BODY', body);
    
    return body;
  },
};
