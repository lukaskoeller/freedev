<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
  // import { browser } from '$app/env';
 
  // if (browser) {
  //   import('ui');
  // }

  const email = 'lukas.koeller@proton.me';
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section>
  <fd-container>
    <fd-container size="xs">
      <fd-stack>
        <h1>Sign Up</h1>
        <form>
          <fd-stack>
            <fd-input name="email" type="email" label="E-Mail"></fd-input>
            <fd-input name="password" type="password" label="Password"></fd-input>
            <fd-switch name="terms">I agree with the terms & conditions.</fd-switch>
            <fd-button type="submit" expand>Submit</fd-button>
            <output></output>
          </fd-stack>
        </form>
      </fd-stack>
      <fd-stack>
        <h1>Wohooo!</h1>
        <h2>E-Mail bestätigen</h2>
        <p>
          Wir haben dir einen Link an <strong>{email}</strong> geschickt.
          Mit einem Klick bestätigst du deine Email.
        </p>
        <p>Nichts bekommen? Schau mal in deinen Spam-Ordner.</p>
        <fd-button>Erneut senden</fd-button>
      </fd-stack>
    </fd-container>
    <script>
      const form = document.querySelector('form');
      const output = document.querySelector('output');

      form.addEventListener('submit', event => {
        event.preventDefault();
        
        const form = event.target;

        /** Get all of the form data */
        const formData = new FormData(form);
        const data = [...formData.entries()];
        data.forEach((value, key) => data[key] = value);
        console.log(data);
        output.innerHTML = JSON.stringify(data, null, 2);
      });
    </script>
  </fd-container>
  <fd-container>
    <fd-container size="xs">
      <fd-stack>
        <h1>What's your name?</h1>
        <fd-input label="Name" name="name" />
        <fd-button>Continue</fd-button>
      </fd-stack>
    </fd-container>
  </fd-container>
  <fd-container>
    <fd-container size="xs">
      <fd-stack>
        <h1>What do you rock at?</h1>
        <fd-input label="Area" name="area" />
        <fd-input label="Language" name="language" />
        <fd-input label="Technologies" name="technology" />
        <fd-button>Continue</fd-button>
      </fd-stack>
    </fd-container>
  </fd-container>
</section>

<style lang="postcss">
</style>