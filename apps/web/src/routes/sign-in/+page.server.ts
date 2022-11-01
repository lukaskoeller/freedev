import { invalid, redirect, type Actions } from "@sveltejs/kit";
import { api } from "../sign-up/_api";

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    console.log('FORM', form);

    const email = form.get('email');
    const password = form.get('password');
  
    const response = await api('POST', 'sign-in', {
      email,
      password,
    });
    const body = await response.json();

    if (body?.statusCode === 500) {
      return invalid(500, { message: body?.message });
    }

    if (body?.statusCode === 400) {
      return invalid(400, { message: body?.message });
    }

    return redirect(301, '/profile');
  },
};
