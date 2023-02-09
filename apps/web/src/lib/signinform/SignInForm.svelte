<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import InputWrapper from "$lib/inputwrapper/InputWrapper.svelte";
	import { notifications } from "$lib/toast/notifications";
	import type { FieldErrors } from "validations";
	import { validate } from "./_validations";

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;

</script>
<form
  method="POST"
  use:enhance={(props) => {
    isSubmitting = true;
    const { form, data, cancel } = props;
    form.dispatchEvent(new CustomEvent('submitting'));
    const email = data.get('email');
    const password = data.get('password');

    const formData = {
      email,
      password,
    };
    
    const { isValid, fields } = validate(formData);

    if (!isValid) {
      cancel();
      formErrors = fields;
      isSubmitting = false;
      return;
    }

    return async (args) => {
      const { result, update } = args;
      switch (result.type) {
        case 'success':
          invalidateAll();
          break;
        case 'error':
          notifications.error(result.error.message);
          // await applyAction(result);
          form.reset();
          // invalidateAll();
          break;
        case 'invalid':
          notifications.warning(result.data.message);
          // form.reset();
          invalidateAll();
          await applyAction(result);
          break;
        default:
          form.reset();
          invalidateAll();
          await applyAction(result);
          update();
      }
      isSubmitting = false;
    }
  }}
>
  <div class="fd-stack">
    <InputWrapper id="email" text={formErrors?.get('email')}>
      <svelte:fragment slot="label">E-Mail</svelte:fragment>
      <input
        class="fd-input"
        name="email"
        type="email"
        required
      />
    </InputWrapper>
    <InputWrapper id="password" text={formErrors?.get('password')}>
      <svelte:fragment slot="label">Password</svelte:fragment>
      <input
        class="fd-input"
        name="password"
        type="password"
      />
    </InputWrapper>
    <button
      class="fd-button"
      type="submit"
      data-status={isSubmitting ? 'loading' : undefined}
      data-expand
    >Sign In</button>
  </div>
</form>