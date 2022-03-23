<script lang="ts">
	// import { page } from '$app/stores';
	import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<header>
	<fd-logo />
	<nav>
		<a href="/profile">Profile</a>
		<a href="/messages">Messages</a>
		<a href="/notifications">Notifications</a>
		<a href="/settings">Settings</a>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		padding-inline: var(--global-spacing);
		padding-block: calc(var(--global-spacing) / 2);
	}

	nav {
		display: flex;
		gap: var(--size-fluid-3);
	}
</style>
