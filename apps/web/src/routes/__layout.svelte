<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
</footer>

<style>
</style>
