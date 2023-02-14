<script lang="ts">
  import Container from '$lib/container/Container.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { onMount } from 'svelte';
	import { Size } from 'types';
	import { notifications } from '$lib/toast/notifications';
	import { validate, type FieldErrors } from './_validations';
	import { invalidateAll } from '$app/navigation';
  import { signIn } from "@auth/sveltekit/client";
  import { page } from "$app/stores"
	import InputWrapper from '$lib/inputwrapper/InputWrapper.svelte';

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
        <code>{JSON.stringify($page.data, null, 2)}</code>
        <form
          on:submit={(e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const username = formData.get('email');
            const password = formData.get('password');
            const data = {
              username,
              password,
            };
            signIn('credentials', data);
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
              />
            </InputWrapper>
            <InputWrapper id="password" text={formErrors?.get('password')}>
              <svelte:fragment slot="label">Password</svelte:fragment>
              <input
                class="fd-input"
                name="password"
                type="password"
                placeholder="Password"
              />
            </InputWrapper>
            <button
              class="fd-button"
              type="submit"
              data-status={isSubmitting ? 'loading' : undefined}
              data-expand
            >Sign In</button>
            <a href="/auth/signin" class="buttonPrimary">Sign in</a>
          </div>
        </form>
      </div>
    </Container>
  </Container>
</section>

<style lang="postcss">
</style>