import { api } from "$lib/common/utils/api.utils";
import { error, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const form = await request.formData();
    console.log('FORM', form);
    
    const confirmationCode = form.get('confirmationCode');
    const username = form.get('username');

    // @todo TEMPORARY Remove
    // throw redirect(301, '/sign-up/signin');
  
    const response = await api({
      fetch,
      method: 'POST',
      resource: 'confirm-sign-up',
      data: {
        confirmationCode,
        username,
      },
    });
    const body = await response.json();

    if (body?.statusCode === 500) {
      return error(500, { message: body?.message ?? 'We could not confirm your account' });
    }

    if (body?.statusCode === 400) {
      return error(400, { message: body?.message ?? 'We could not confirm your account. That might happened due to a wrong code. Try to enter it again.' });
    }

    // return { message: body?.message ?? 'Successfully confirmed your account 🥳' }
    throw redirect(301, '/sign-up/signin');
  },
};
