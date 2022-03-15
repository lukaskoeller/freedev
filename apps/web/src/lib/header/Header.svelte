<script lang="ts">
	// import { page } from '$app/stores';
	import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<header>
	<fd-logo />
	<nav>Navigation</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
</style>
