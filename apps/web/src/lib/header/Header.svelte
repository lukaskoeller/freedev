<script lang="ts">
	// import { page } from '$app/stores';
	import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<header>
	<slot />
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		padding-inline: var(--global-spacing);
		padding-block: calc(var(--global-spacing) / 2);
	}
</style>
