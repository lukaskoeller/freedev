import { invalid, type Actions } from "@sveltejs/kit";
import { api } from "../sign-up/_api";

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    console.log('FORM', form);
    
    const confirmationCode = form.get('confirmationCode');
    const username = form.get('username');
  
    const response = await api('POST', 'confirm-sign-up', {
      confirmationCode,
      username,
    });
    const body = await response.json();

    if (body?.statusCode === 500) {
      return invalid(500, { message: body?.message ?? 'We could not confirm your account' });
    }

    if (body?.statusCode === 400) {
      return invalid(400, { message: body?.message ?? 'We could not confirm your account. That mifht happened due to a wrong code. Try to enter it again.' });
    }

    return { message: body?.message ?? 'Successfully confirmed your account 🥳' }
  },
};
