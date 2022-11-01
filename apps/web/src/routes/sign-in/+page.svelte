<script lang="ts">
  import Container from '$lib/container/Container.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { onMount } from 'svelte';
	import { Size } from 'types';
	import { notifications } from '$lib/toast/notifications';
	import { validate, type FieldErrors } from './_validations';
	import { invalidateAll } from '$app/navigation';

  onMount(async () => {
    await import('ui');
  });

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<section>
  <Container>
    <Container size={Size.Xs}>
      <div class="fd-stack">
        <h1>Sign In</h1>
        <form
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
                  invalidateAll();
                  break;
                case 'error':
                  notifications.error('Something went wrong when signing in 😢');
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
            <fd-input
              name="email"
              type="email"
              label="E-Mail"
              required
              error={formErrors?.get('email')}
            ></fd-input>
            <fd-input
              name="password"
              type="password"
              label="Password"
              error={formErrors?.get('password')}
            ></fd-input>
            <fd-button
              type="submit"
              status={isSubmitting ? 'loading' : undefined}
              expand
            >Sign In</fd-button>
          </div>
        </form>
      </div>
    </Container>
  </Container>
</section>

<style lang="postcss">
</style>