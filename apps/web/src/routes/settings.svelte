<script lang="ts">
	import { onMount } from 'svelte';
		onMount(async () => {
			await import('ui');
		});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<section>
	<h1>Settings</h1>
	<p>
		This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
		following into your command line and following the prompts:
	</p>
	<fd-card class="settings">
		<fd-section class="separator" fullWidth={true} hasBorder={true}>
			<fd-input type="email">E-Mail</fd-input>
		</fd-section>
	</fd-card>
</section>

<style lang="postcss">
	.settings::part(card) {
		display: block;
		margin-inline: auto;
		margin-block: var(--global-spacing);
		inline-size: 50vw;
	}
</style>
