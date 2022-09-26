<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import { onMount } from 'svelte';
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
	import bgSvg from '../assets/svg/freedev-bg.svg?url';
	import bgLgSvg from '../assets/svg/freedev-bg-large.svg?url';
	onMount(async () => {
    await import('ui');
  });
</script>

<section style:background={`url('${bgLgSvg}') center 20% no-repeat`}>
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

	section {
		background-repeat: no-repeat;
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
