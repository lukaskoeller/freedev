<script lang="ts">
  import Container from '$lib/container/Container.svelte';
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { onMount } from 'svelte';
	import { Size } from 'types';

  onMount(async () => {
    await import('ui');
  });
  // import { browser } from '$app/env';
 
  // if (browser) {
  //   import('ui');
  // }

  export let form: ActionData;
  
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section>
  <Container>
    <Container size={Size.Xs}>
      {#if form?.statusCode !== 200}
        <div class="fd-stack">
          <h1>Sign Up</h1>
          <form
            action="?/signup"
            method="POST"
            use:enhance
          >
            <div class="fd-stack">
              <fd-input name="email" type="email" label="E-Mail" required></fd-input>
              <fd-input name="password" type="password" label="Password"></fd-input>
              <fd-switch name="terms">I agree with the terms & conditions.</fd-switch>
              <fd-button type="submit" expand>Submit</fd-button>
              {#if form?.message}
                <p>{form?.message}</p>
              {/if}
            </div>
          </form>
        </div>
      {:else}
        <div class="fd-stack">
          <h1>Wohooo!</h1>
          <h2>E-Mail bestätigen</h2>
          <p>
            Wir haben dir einen Link an <strong>{form?.email}</strong> geschickt.
            Mit einem Klick bestätigst du deine Email.
          </p>
          <p>Nichts bekommen? Schau mal in deinen Spam-Ordner.</p>
          <fd-button>Erneut senden</fd-button>
        </div>
      {/if}
    </Container>
  </Container>
  <Container>
    <Container size={Size.Xs}>
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