import type { Action } from "@sveltejs/kit";
import { api } from "./_api";

export const PUT: Action = async (event) => {
  console.log('PUT');
  
  const form = await event.request.formData();

  console.log('form', form);
  
  const response = await api('PUT', 'sign-up', {
    email: form.get('email'),
    password: form.get('password'),
  });
  const body = await response.json();
  console.log('RESPONSE', response);
  console.log('BODY', body);
};