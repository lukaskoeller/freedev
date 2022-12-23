<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { notifications } from "$lib/toast/notifications";
	import { onMount } from "svelte";
	import type { FieldErrors } from "validations";
	import FormContainer from "../FormContainer.svelte";
	import { validate } from "./_validations";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What should we call you?';

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-name"
    method="POST"
    use:enhance={(props) => {
      isSubmitting = true;
      const { form, data, cancel } = props;
      form.dispatchEvent(new CustomEvent('submitting'));
      const handle = data.get('handle');
      const firstName = data.get('firstName');
      const lastName = data.get('lastName');

      const formData = {
        handle,
        firstName,
        lastName,
      };
      
      const { isValid, fields } = validate(formData);

      if (!isValid) {
        cancel();
        formErrors = fields;
        isSubmitting = false;
        return;
      }

      return async (args) => {
        console.log({ args });
        const { result, update } = args;
        switch (result.type) {
          case 'success':
            invalidateAll();
            break;
          case 'error':
            notifications.error('Something went wrong 😢');
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
      <fd-input
        name="handle"
        type="text"
        label="handle"
        required
        error={formErrors?.get('handle')}
      ></fd-input>
      <fd-input
        name="firstName"
        type="text"
        label="First Name"
        required
        error={formErrors?.get('firstName')}
      ></fd-input>
      <fd-input
        name="lastName"
        type="text"
        label="Last Name"
        required
        error={formErrors?.get('lastName')}
      ></fd-input>
    </div> 
  </form>
  <fd-button
    slot="footer"
    form="sign-up-name"
    expand
  >
    Continue
  </fd-button>
</FormContainer>