<script lang="ts">
import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Notifications</title>
</svelte:head>

<section>
  <h1>Notifications</h1>
  <fd-container>
    <fd-button href="/">Home</fd-button>
  </fd-container>
</section>