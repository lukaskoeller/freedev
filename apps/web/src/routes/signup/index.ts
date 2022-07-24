import type { RequestHandler } from "@sveltejs/kit";
import { api } from "./_api";

export const PUT: RequestHandler = async (event) => {
  const form = await event.request.formData();

  const response = await api('PUT', 'signup', {
    email: form.get('email'),
    password: form.get('password'),
  });
  const body = await response.json();
  console.log('RESPONSE', response);
  console.log('BODY', body);
  
  return response;
};