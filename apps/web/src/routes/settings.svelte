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

<fd-container>
	<h1>Settings</h1>
</fd-container>
<fd-container>
	<fieldset>
		<legend>
			Account
		</legend>
		<fd-card>
			<fd-stack>
				<SettingsItem>
					<fd-icon slot="icon" size="xl" file={svgAtSolid} />
					<div slot="input">
						<fd-switch name="stayLoggedIn">
							<fd-label>Angemeldet bleiben</fd-label>
						</fd-switch>
					</div>
				</SettingsItem>
				<SettingsItem>
					<fd-icon slot="icon" size="xl" file={svgAtSolid} />
					<fd-input slot="input" type="email" placeholder="example@mail.de">E-Mail</fd-input>
				</SettingsItem>
			</fd-stack>
		</fd-card>
	</fieldset>
</fd-container>

<style lang="postcss">
	::part(container) {
		display: grid;
		justify-items: center;
	}

	fieldset {
		inline-size: min(800px, 100%);
	}

	legend {
		font-weight: var(--font-weight-h2);
		font-size: var(--font-size-h3);
		color: var(--primary-color-h2);
	}

	fd-input {
		inline-size: 100%;
	}
</style>
