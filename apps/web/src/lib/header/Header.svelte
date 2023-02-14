<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import bellSolid from 'assets/icons/bell-solid.svg?raw';
	import cogSolid from 'assets/icons/cog-solid.svg?raw';
	import paperPlaneSolid from 'assets/icons/paper-plane-solid.svg?raw';
	import userCircleSolid from 'assets/icons/user-circle-solid.svg?raw';
	import Logo from '$lib/logo/Logo.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import { Size } from 'types';
</script>

<header>
	<a href="/">
		<Logo />
	</a>
	<nav>
		{#if $page.data.session?.user}
			<a href="/profile">
				<Icon size={Size.Lg}>
					{@html userCircleSolid}
				</Icon>
				<span>Profile</span>
			</a>
			<a href="/messages">
				<Icon size={Size.Lg}>
					{@html paperPlaneSolid}
				</Icon>
				<span>Messages</span>
			</a>
			<a href="/notifications">
				<Icon size={Size.Lg}>
					{@html bellSolid}
				</Icon>
				<span>Notifications</span>
			</a>
			<a href="/settings">
				<Icon size={Size.Lg}>
					{@html cogSolid}
				</Icon>
				<span>Settings</span>
			</a>
		{:else}
			<a
				class="fd-button"
				href="/sign-in"
				data-variant="light"
			>
				Sign In
			</a>
			<a
				class="fd-button"
				href="/sign-up"
			>
				Sign Up
			</a>
		{/if}
	</nav>
</header>

<style lang="postcss">
	header {
		position: fixed;
		z-index: var(--layer-5);
		bottom: 0;
		left: 0;

		inline-size: 100%;
		display: flex;
		justify-content: space-between;
		padding-inline: var(--global-spacing);
		padding-block-start: calc(var(--global-spacing) / 2);
		padding-block-end: calc(
			var(--global-spacing) / 2
			+ env(safe-area-inset-bottom)
		);

		/* background-color: var(--neutral-color-base); */
		/* background-color: hsl(252deg 28% 93% / 60%); */
		backdrop-filter: blur(16px);
		/* box-shadow: var(--shadow-5); */

		@media (--tablet) {
			backdrop-filter: none;
			position: relative;
		}
	}

	fd-logo {
		display: none;

		@media (--tablet) {
			display: block;
		}
	}

	nav {
		display: flex;
		inline-size: 100%;
		justify-content: space-around;
		align-items: flex-start;
		gap: var(--size-fluid-3);

		@media (--tablet) {
			inline-size: auto;
			justify-content: normal;
		}
	}

	a {
		display: grid;
		justify-items: center;
		text-decoration: none;
	}
</style>
