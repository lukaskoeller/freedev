import { error, invalid, redirect, type Actions } from "@sveltejs/kit";
import { api } from "./_api";
import { validate } from "./_validations";

export const actions: Actions = {
  signUp: async ({ request }) => {
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
      return invalid(400, { message: 'We could not sign you up. Try to adjust your inputs.' });
    }

    const response = await api('PUT', 'sign-up', {
      email,
      password,
    });
    const body = await response.json();
    console.log('RESPONSE BODY', body);
    
    
    const username = body?.UserSub;

    if (!username || body?.statusCode === 500) {
      return invalid(500, { message: body?.message ?? 'We could not sign up this user' });
    }

    if (body?.statusCode === 400) {
      return invalid(400, { message: body?.message ?? 'We could not sign you up. Try to adjust your inputs.' });
    }

    const params = new URLSearchParams({
      username,
      email: body?.CodeDeliveryDetails?.Destination,
    });
    
    throw redirect(301, `/confirm-sign-up?${params}`);
    // throw redirect(301, `/confirm-sign-up?username=123456789&email=l***@p***`);
  },
};
