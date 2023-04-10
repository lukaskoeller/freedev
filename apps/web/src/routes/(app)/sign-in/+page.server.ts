import { redirect, type Actions } from "@sveltejs/kit";
import { signIn } from "@auth/sveltekit/client";
import { signInServer } from "$lib/signinform/signIn.server";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // await signInServer(request, cookies);

    // throw redirect(301, '/profile');
  },
};
