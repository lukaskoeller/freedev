<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import { onMount } from 'svelte';
	onMount(async () => {
    await import('ui');
  });
</script>


<Header />
<div class="logoWrapper">
	<a href="/">
		<fd-logo />
	</a>
</div>
<main>
	<slot />
</main>
<footer>
	<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
</footer>

<style lang="postcss">
	:global(body) {
		/* Compensate for fixed navigation bar's height */
		padding-bottom: var(--size-10);

		@media (--tablet) {
			padding-bottom: 0;
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
</style>
