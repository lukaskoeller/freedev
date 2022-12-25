import { api } from "$lib/common/utils/api.utils";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { validate } from "./_validations";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get('token');
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

    const cleanedData = {
      hourlyRate,
      availableFrom,
      capacity: capacity === 'custom'
        ? customCapacity
        : capacity,
    }
    console.log(data);
    const response = await api({
      fetch,
      method: 'PUT',
      resource: 'user',
      data: cleanedData,
      token,
    });
    console.log(response);
    const body = {};

    if (body?.message === 'Unauthorized') {
      return redirect(301, '/sign-in');
    }

    if (body?.statusCode === 500) {
      return error(500, { message: body?.message ?? 'We could not update the user. Please try again. If the problem persists, contact customer service.' });
    }

    if (body?.statusCode === 400) {
      return error(400, { message: body?.message ?? 'We could not update the user.' });
    }

    const { isValid } = validate(data);
    if (!isValid) {
      return error(400, { message: 'Something about your submitted data is wrong. Check any error messages. Please adjust and try again.' });
    }

    // @todo TEMPORARY Remove
    throw redirect(301, '/sign-up/skills');
  },
};