import { error, invalid, redirect, type Actions } from "@sveltejs/kit";
import { api } from "./_api";

export const actions: Actions = {
  signUp: async ({ request }) => {
    console.log('signUp request', request);
    
    const form = await request.formData();
    const email = form.get('email');

    const response = await api('PUT', 'sign-up', {
      email: email,
      password: form.get('password'),
    });
    const body = await response.json();
    
    const username = body?.data?.UserSub;

    if (!username) {
      return invalid(500, { message: 'We could not sign up this user' });
    }

    const params = new URLSearchParams({
      username,
      email: body?.data?.CodeDeliveryDetails?.Destination,
    });
    
    // return body;
    throw redirect(301, `/confirm-sign-up?${params}`)
    // return { statusCode: 200, message: 'Successfully signed up', email };
  },
  confirmSignUp: async ({ request }) => {
    const form = await request.formData();
    console.log('FORM', form);
    
    const confirmationCode = form.get('confirmationCode');
    const username = form.get('username');

    console.log('PAYLOAD', {
      confirmationCode,
      username,
    });

    const response = await api('POST', 'confirm-sign-up', {
      confirmationCode,
      username,
    });

    if (response.status !== 200) {
      return invalid(500, { message: 'We could not confirm this user' });
    }

    const body = await response.json();
    console.log('BODY', body);
    
    return body;
  },
};
