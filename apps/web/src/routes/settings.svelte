<script lang="ts">
	import SettingsItem from '$lib/settingsitem/SettingsItem.svelte';
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
		<SettingsItem>
			<fd-icon slot="icon" size="xl" file={svgAtSolid} />
			<fd-input slot="input" type="email" placeholder="example@mail.de">E-Mail</fd-input>
		</SettingsItem>
		<SettingsItem>
			<fd-icon slot="icon" size="xl" file={svgAtSolid} />
			<fd-input slot="input" type="email" placeholder="example@mail.de">E-Mail</fd-input>
		</SettingsItem>
	</fd-card>
</fd-container>

<style lang="postcss">
	::part(container) {
		display: flex;
		justify-content: center;
	}

	fd-card {
		inline-size: min(600px, 100%);
	}

	::part(card) {
		padding-inline-end: 0px;
	}
</style>
