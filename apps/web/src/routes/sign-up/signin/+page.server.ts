import { signInServer } from "$lib/signinform/signIn.server";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    await signInServer(request, cookies);

    // @todo TEMPORARY Remove
    throw redirect(301, '/sign-up/name');
  },
};