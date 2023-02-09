<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import InputWrapper from "$lib/inputwrapper/InputWrapper.svelte";
	import { notifications } from "$lib/toast/notifications";
	import type { FieldErrors } from "validations";
	import FormContainer from "../FormContainer.svelte";
	import { validate } from "./_validations";

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
      <InputWrapper id="handle" text={formErrors?.get('handle')}>
        <svelte:fragment slot="label">handle</svelte:fragment>
        <input
          class="fd-input"
          name="handle"
          type="text"
          required
        />
      </InputWrapper>
      <InputWrapper id="firstName" text={formErrors?.get('firstName')}>
        <svelte:fragment slot="label">First Name</svelte:fragment>
        <input
          class="fd-input"
          name="firstName"
          type="text"
          required
        />
      </InputWrapper>
      <InputWrapper id="lastName" text={formErrors?.get('lastName')}>
        <svelte:fragment slot="label">Last Name</svelte:fragment>
        <input
          class="fd-input"
          name="lastName"
          type="text"
          required
        />
      </InputWrapper>
    </div> 
  </form>
  <button
    class="fd-button"
    slot="footer"
    form="sign-up-name"
    data-expand
  >
    Continue
  </button>
</FormContainer>