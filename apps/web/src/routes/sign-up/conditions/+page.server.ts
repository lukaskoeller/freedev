import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    // @todo TEMPORARY Remove
    throw redirect(301, '/sign-up/skills');
  },
};