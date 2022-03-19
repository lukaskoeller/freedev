<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import NavItem from '$lib/navitem/NavItem.svelte';
	import 'ui/src/styles/globals.css';
	import 'ui/src/styles/props.css';
	import '../app.css';
</script>

<Header>
	<fd-logo />
	<nav>
		<NavItem href="/profile">Profile</NavItem>
	</nav>
</Header>
<main>
	<slot />
</main>
<footer>
	<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
</footer>

<style>
</style>
