<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import { onMount } from 'svelte';
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
	import bgLgSvg from '$lib/assets/svg/freedev-bg-large.svg?url';
	onMount(async () => {
    await import('ui');
  });
</script>

<section class="wrapper" style:background-image={`url('${bgLgSvg}')`}>
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
</section>

<style lang="postcss">

	.wrapper {
		min-block-size: 100vh;
		background-repeat: no-repeat;
		background-position: center 0%;

		@media (--tablet) {
			background-position: center 20%;
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
