<script lang="ts">
  import Container from '$lib/container/Container.svelte';
  import { applyAction, enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { onMount } from 'svelte';
	import { Size } from 'types';
  import { page } from '$app/stores';
	import { notifications } from '$lib/toast/notifications';
	import { validate, type FieldErrors } from './_validations';
	import { invalidateAll } from '$app/navigation';

  onMount(async () => {
    await import('ui');
  });

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;

  $: username = $page.url.searchParams.get('username');
  $: email = $page.url.searchParams.get('email');
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section>
  <Container>
    <Container size={Size.Xs}>
      <div class="fd-stack">
        <h1>Sign Up</h1>
        <form
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
            >Submit</fd-button>
            isSubmitting: {isSubmitting}
          </div>
        </form>
      </div>
    </Container>
  </Container>
  <Container>
    <Container size={Size.Xs}>
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
      <div class="fd-stack">
        <h1>What's your name?</h1>
        <fd-input label="Name" name="name" />
        <fd-button>Continue</fd-button>
      </div>
    </Container>
  </Container>
  <Container>
    <Container size={Size.Xs}>
      <div class="fd-stack">
        <h1>What do you rock at?</h1>
        <fd-input label="Area" name="area" />
        <fd-input label="Language" name="language" />
        <fd-input label="Technologies" name="technology" />
        <fd-button>Continue</fd-button>
      </div>
    </Container>
  </Container>
</section>

<style lang="postcss">
</style>