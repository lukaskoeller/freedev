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
    <form>
      <fd-input name="email" type="email" label="E-Mail"></fd-input>
    </form>
  </fd-container>
</section>