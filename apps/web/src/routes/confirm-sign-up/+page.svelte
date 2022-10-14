<script lang="ts">
	import Container from "$lib/container/Container.svelte";
  import { page } from '$app/stores';
	import { Size } from "types";
  import type { ActionData } from './$types';
	import { applyAction, enhance } from "$app/forms";
	import SplitInput from "$lib/splitinput/SplitInput.svelte";
	import { onMount } from "svelte";

  onMount(async () => {
    await import('ui');
  });

  export let form: ActionData;

  $: username = $page.url.searchParams.get('username');
  $: email = $page.url.searchParams.get('email');
</script>

<svelte:head>
	<title>Confirm your sign up</title>
</svelte:head>

<section>
  <Container>
    <Container size={Size.Xs}>
      <div class="fd-stack">
        <h1>Wohooo!</h1>
        <h2>E-Mail bestätigen</h2>
        <p>
          Wir haben dir einen Link an <strong>{email}</strong> geschickt.
          Mit einem Klick bestätigst du deine Email.
        </p>
        <form
          method="POST"
          use:enhance={() => {
            return async ({ result, update }) => {
              applyAction(result);
              if (result.type === 'success') return;
              update();
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
        <fd-button>Erneut senden</fd-button>
      </div>
    </Container>
  </Container>
</section>