import { api } from "$lib/common/utils/api.utils";
import { getAccessToken } from "$lib/common/utils/auth.utils";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { validate } from "./_validations";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // const token = cookies.get(TOKEN_NAME);
    const { accessToken: token } = await getAccessToken(cookies);
    const form = await request.formData();
    const hourlyRate = form.get('hourlyRate');
    const availableFrom = form.get('availableFrom');
    const capacity = form.get('capacity');
    const customCapacity = form.get('customCapacity');

    const data = {
      hourlyRate,
      availableFrom,
      capacity,
      customCapacity,
    };
    console.log(token);
    

    const { isValid } = validate(data);
    if (!isValid) {
      return error(400, { message: 'Something about your submitted data is wrong. Check any error messages. Please adjust and try again.' });
    }

    const cleanedData = {
      hourlyRate,
      availableFrom,
      capacity: capacity === 'custom'
        ? customCapacity
        : capacity,
    }

    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'user',
      data: cleanedData,
      token,
    });

    if (response.status === 200) {
      throw redirect(301, '/sign-up/skills');
    }

    return error(400, { message: 'We could not update your account due to a technical issue on our end. Please try connecting again. If the issue keeps happening, contact Customer Care.' });
  },
};