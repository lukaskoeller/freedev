<script lang="ts">
	// import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import bellSolid from 'assets/icons/bell-solid.svg?raw';
	import cogSolid from 'assets/icons/cog-solid.svg?raw';
	import paperPlaneSolid from 'assets/icons/paper-plane-solid.svg?raw';
	import userCircleSolid from 'assets/icons/user-circle-solid.svg?raw';
  onMount(async () => {
    await import('ui');
  });
</script>

<header>
	<fd-logo />
	<nav>
		<a href="/profile">
			<fd-icon file={userCircleSolid} size="lg" />
			<span>Profile</span>
		</a>
		<a href="/messages">
			<fd-icon file={paperPlaneSolid} size="lg" />
			<span>Messages</span>
		</a>
		<a href="/notifications">
			<fd-icon file={bellSolid} size="lg" />
			<span>Notifications</span>
		</a>
		<a href="/settings">
			<fd-icon file={cogSolid} size="lg" />
			<span>Settings</span>
		</a>
	</nav>
</header>

<style>
	header {
		position: sticky;
		bottom: 0;
		left: 0;

		inline-size: 100%;
		display: flex;
		justify-content: space-between;
		padding-inline: var(--global-spacing);
		padding-block: calc(var(--global-spacing) / 2);

		/* background-color: var(--neutral-color-base); */
		background-color: hsl(252deg 28% 93% / 60%);
		backdrop-filter: blur(16px);
		box-shadow: var(--shadow-5);
	}

	nav {
		display: flex;
		gap: var(--size-fluid-3);
	}

	a {
		display: grid;
		justify-items: center;
		text-decoration: none;
	}
</style>
