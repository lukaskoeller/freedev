<script lang="ts">
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
	import bgLgSvg from '$lib/assets/svg/freedev-bg-large.svg?url';
	import ToastProvider from '$lib/toast/ToastProvider.svelte';
</script>

<section class="wrapper" style:background-image={`url('${bgLgSvg}')`}>
	<slot></slot>
	<ToastProvider />
</section>

<style lang="postcss">
	.wrapper {
		min-block-size: 100vh;
		background-repeat: no-repeat;
		background-position: center 0%;

		@media (--tablet) {
			background-position: center 12vh;
		}
	}
</style>