<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import { onMount } from 'svelte';
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
	import bgLgSvg from '$lib/assets/svg/freedev-bg-large.svg?url';
	import { notifications } from '$lib/toast/notifications';
	import Toast from '$lib/toast/Toast.svelte';
	import { flip } from 'svelte/animate';
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
	<div
		class="toastContainer"
		role="region"
		aria-live="polite"
	>
	{#each $notifications as notification (notification.id)}
		<div class="item" animate:flip>
			<Toast
				type={notification.type}
				message={notification.message}
			></Toast>
		</div>
	{/each}
	</div>
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

	.toastContainer {
		position: fixed;
		padding: var(--size-3);
    z-index: var(--layer-5);
    pointer-events: none;
    display: flex;
		flex-direction: column;
		align-items: center;
    gap: var(--size-3);
    margin: 0px auto;
    bottom: env(safe-area-inset-bottom, 0px);
    right: env(safe-area-inset-right, 0px);
    left: env(safe-area-inset-left, 0px);	
	}

	.item {
		display: contents;
	}
</style>
