import { api } from "$lib/common/utils/api.utils";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { validate } from "./_validations";

export const actions: Actions = {
  signUp: async ({ request, fetch }) => {
    console.log('signUp request', request);
    
    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');

    const data = {
      email,
      password,
    }

    const { isValid } = validate(data);
    if (!isValid) {
      return error(400, { message: 'We could not sign you up. Try to adjust your inputs.' });
    }

    // @todo TEMPORARY Remove
    // throw redirect(301, `/sign-up/confirm?username=123456789&email=l***@p***`);

    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'sign-up',
      data: {
        email,
        password,
      },
    });
    const body = await response.json();
    console.log('RESPONSE BODY', body); // @todo remove
    
    const username = body?.UserSub;

    if (!username || body?.statusCode === 500) {
      return error(500, { message: body?.message ?? 'We could not sign up this user' });
    }

    if (body?.statusCode === 400) {
      return error(400, { message: body?.message ?? 'We could not sign you up. Try to adjust your inputs.' });
    }

    const params = new URLSearchParams({
      username,
      email: body?.CodeDeliveryDetails?.Destination,
    });
    
    throw redirect(301, `/sign-up/confirm?${params}`);
  },
};
