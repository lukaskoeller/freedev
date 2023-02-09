<script lang="ts">
  import { page } from '$app/stores';
  import type { ActionData } from './$types';
	import { applyAction, enhance } from "$app/forms";
	import SplitInput from "$lib/splitinput/SplitInput.svelte";
	import { invalidateAll } from "$app/navigation";
	import { notifications } from "$lib/toast/notifications";
	import FormContainer from "../FormContainer.svelte";

  export let form: ActionData;
  let isSubmitting: boolean = false;

  $: username = $page.url.searchParams.get('username');
  $: email = $page.url.searchParams.get('email');

  const heading: string = 'Let\'s confirm! 📨';
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <div class="fd-stack">
    <p>
      Wir haben dir einen Link an <strong>{email}</strong> geschickt.
      Mit einem Klick bestätigst du deine Email.
    </p>
    <form
      method="POST"
      use:enhance={(props) => {
        const { form } = props;
        
        isSubmitting = true;
        return async (args) => {
          console.log({ args });
          const { result, update } = args;
          switch (result.type) {
            case 'success':
              notifications.success(result.data.message);
              invalidateAll();
              break;
            case 'error':
              notifications.error('Something went wrong');
              // await applyAction(result);
              form.reset();
              // invalidateAll();
              break;
            default:
              notifications.info('This is a default message');
              form.reset();
              invalidateAll();
              await applyAction(result);
              update();
          }
          isSubmitting = false;
        };
      }}
    >
      <SplitInput ariaInvalid={form && form?.statusCode !== 200} />
      <input type="text" name="username" hidden value={username}>
      {#if form?.statusCode === 200}
        <p>{form.body.data.message}</p>
      {/if}
    </form>
    <p>Nichts bekommen? Schau mal in deinen Spam-Ordner.</p>
  </div>
  <button
    class="fd-button"
    slot="footer"
    data-expand
  >
    Email App öffnen
  </button>
</FormContainer>