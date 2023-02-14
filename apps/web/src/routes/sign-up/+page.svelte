<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { page } from '$app/stores';
	import { notifications } from '$lib/toast/notifications';
	import { validate } from './_validations';
	import { invalidateAll } from '$app/navigation';
	import FormContainer from './FormContainer.svelte';
	import type { FieldErrors } from 'validations';
	import InputWrapper from '$lib/inputwrapper/InputWrapper.svelte';

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;

  $: username = $page.url.searchParams.get('username');
  $: email = $page.url.searchParams.get('email');
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<FormContainer heading="Hello, you!">
  <form
    id="sign-up"
    action="?/signUp"
    method="POST"
    use:enhance={(props) => {
      isSubmitting = true;
      const { form, data, cancel } = props;
        for (const [key, value] of data.entries()) {
          console.log(`${key}: ${value}`); 
        }
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
        console.log({ args });
        const { result, update } = args;
        switch (result.type) {
          case 'success':
            notifications.success('Welcome on board 👋');
            invalidateAll();
            break;
          case 'error':
            notifications.error('Something went wrong when signing you up 😢');
            // await applyAction(result);
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
      <InputWrapper id="email" text={formErrors?.get('email')}>
        <svelte:fragment slot="label">E-Mail</svelte:fragment>
        <input
          class="fd-input"
          name="email"
          type="email"
          placeholder="E-Mail"
          required
        >
      </InputWrapper>
      <InputWrapper id="password" text={formErrors?.get('password')}>
        <svelte:fragment slot="label">Password</svelte:fragment>
        <input
          class="fd-input"
          name="password"
          type="password"
          placeholder="Passwort"
        >
      </InputWrapper>
      <!-- Submit in slot=footer -->
    </div>
  </form>
  <div slot="footer">
    <button
      class="fd-button"
      data-expand
      type="submit"
      form="sign-up"
    >
      Submit
    </button>
  </div>  
  <!-- <Toast message="Successfully signed up!">
    <div slot="before">
      <Icon
        size={Size.Md}
        --fd-icon-fill="var(--color-status-success)"
      >{@html checkCircleSvg}</Icon>
    </div>
    <p slot="body" class="fd-info-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quia, et fugit, commodi quis sequi blanditiis autem.</p>
  </Toast>
  <Toast message="Successfully signed up!">
    <p slot="body" class="fd-info-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quia, et fugit, commodi quis sequi blanditiis autem.</p>
  </Toast>
  <Toast message="Successfully signed up!"></Toast>
  <Toast message="Successfully signed up!">
    <div slot="before">
      <Icon
        size={Size.Md}
        --fd-icon-fill="var(--color-status-success)"
      >{@html checkCircleSvg}</Icon>
    </div>
  </Toast> -->
  <!-- <div class="fd-stack">
    <h1>What's your name?</h1>
    <fd-input label="Name" name="name" />
    <fd-button>Continue</fd-button>
  </div>
  <div class="fd-stack">
    <h1>What do you rock at?</h1>
    <fd-input label="Area" name="area" />
    <fd-input label="Language" name="language" />
    <fd-input label="Technologies" name="technology" />
    <fd-button>Continue</fd-button>
  </div> -->
</FormContainer>

<style lang="postcss">
</style>