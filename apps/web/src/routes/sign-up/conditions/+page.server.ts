import { redirect, type Actions } from "@sveltejs/kit";

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
      capacity: capacity === 'custom'
        ? customCapacity
        : capacity,
    };
    console.log(data);

    // @todo TEMPORARY Remove
    throw redirect(301, '/sign-up/skills');
  },
};