import type { Handle } from '@sveltejs/kit';
 
export const handle: Handle = async ({ event, resolve }) => {
  const token = event?.cookies?.get('token');
  
  if (!token) {
    // @todo src/app.d.ts declare namespace App { interface Locals {} }
    event.locals.user = { isAuthenticated: false };
    const response = await resolve(event);
    return response;
  }

  event.locals.user = { isAuthenticated: true };
 
  const response = await resolve(event);
  return response;
}