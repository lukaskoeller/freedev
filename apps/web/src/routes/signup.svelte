<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section>
  <fd-container>
    <h1>E-Mail</h1>
    <fd-card>
      <form>
        <fd-stack>
          <fd-input name="email" type="email" label="E-Mail"></fd-input>
          <fd-input name="password" type="password" label="Password"></fd-input>
          <fd-switch name="terms">I agree with the terms & conditions.</fd-switch>
          <fd-button type="submit">Submit</fd-button>
        </fd-stack>
      </form>
    </fd-card>
    <output></output>
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
</section>

<style lang="postcss">
  fd-card::part(card) {
    inline-size: min(var(--size-content-3), 100%);
  }
</style>