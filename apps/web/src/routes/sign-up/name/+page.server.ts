import { TOKEN_NAME } from "$lib/common/constants";
import { api } from "$lib/common/utils/api.utils";
import { invalid, redirect, type Actions } from "@sveltejs/kit";
import { validate } from "./_validations";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get(TOKEN_NAME);
    const form = await request.formData();
    const handle = form.get('handle');
    const firstName = form.get('firstName');
    const lastName = form.get('lastName');

    const data = {
      handle,
      firstName,
      lastName,
    }
    console.log(data);
    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'user',
      data,
      token,
    });
    console.log(response);
    const body = {};

    if (body?.message === 'Unauthorized') {
      return redirect(301, '/sign-in');
    }

    if (body?.statusCode === 500) {
      return invalid(500, { message: body?.message ?? 'We could not update the user. Please try again. If the problem persists, contact customer service.' });
    }

    if (body?.statusCode === 400) {
      return invalid(400, { message: body?.message ?? 'We could not update the user.' });
    }

    const { isValid } = validate(data);
    if (!isValid) {
      return invalid(400, { message: 'Something about your submitted data is wrong. Check any error messages. Please adjust and try again.' });
    }
    
    
    // @todo TEMPORARY Remove
    throw redirect(301, '/sign-up/conditions');
  },
};