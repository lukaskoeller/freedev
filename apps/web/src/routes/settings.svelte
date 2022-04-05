<script lang="ts">
	import svgAtSolid from 'assets/icons/at-solid.svg?raw';
	import svgUserCircleSolid from 'assets/icons/user-circle-solid.svg?raw';
	import { onMount } from 'svelte';
		onMount(async () => {
			await import('ui');
		});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<h1>Settings</h1>
<p>
	This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
	following into your command line and following the prompts:
</p>
<fd-container>
	<fd-card>
		<div class="item">
			<div class="icon">
				<fd-icon size="xl" file={svgAtSolid} />
			</div>
			<div class="input">
				<fd-hr />
				<fd-input type="email" placeholder="example@mail.de">E-Mail</fd-input>
			</div>
		</div>
	</fd-card>
</fd-container>

<style lang="postcss">
	::part(container) {
		display: flex;
		justify-content: center;
	}
	::part(card) {
		inline-size: min(600px, 100%);
		padding-inline-end: 0;
	}
	.item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--size-4);
	}

	.icon {
		padding-block-start: var(--size-3);
	}

	.input {
		display: grid;
		gap: var(--size-3);
	}
</style>
