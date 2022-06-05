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
	<title>Messages</title>
</svelte:head>

<section>
  <h1>Messages</h1>
  <fd-container>
    <fd-button href="/signup">Sign Up</fd-button>
  </fd-container>
</section>