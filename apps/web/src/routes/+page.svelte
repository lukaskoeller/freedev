<script lang="ts">
import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
  <fd-container>
    <fd-button href="/sign-up">Sign Up</fd-button>
  </fd-container>
</section>