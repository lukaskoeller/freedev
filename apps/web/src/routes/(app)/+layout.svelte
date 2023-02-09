<script lang="ts">
	import { signOut } from "@auth/sveltekit/client";
	import Header from '$lib/header/Header.svelte';
	import Container from "$lib/container/Container.svelte";

	import Logo from "$lib/logo/Logo.svelte";
</script>


<Header />
<div class="logoWrapper">
	<a href="/">
		<Logo />
	</a>
</div>
<main>
	<slot />
</main>
<footer>
	<Container>
		<button class="fd-button" on:click={() => signOut()}>Sign Out</button>
	</Container>
</footer>

<style lang="postcss">
	:global(body) {
		/* Compensate for fixed navigation bar's height */
		padding-block-end: var(--size-10);

		@media (--tablet) {
			padding-block-end: 0;
		}
		}
	.logoWrapper {
		display: grid;
		place-items: center;
		padding-block: var(--size-2);

		@media (--tablet) {
			display: none;
		}
	}

	footer {
		display: flex;
	}

	footer fd-button {
		margin-inline-start: auto;
	}
</style>
