<script lang="ts">
	import Container from '$lib/container/Container.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import InputWrapper from '$lib/inputwrapper/InputWrapper.svelte';
	import SettingsItem from '$lib/settingsitem/SettingsItem.svelte';
import svgAtSolid from 'assets/icons/at-solid.svg?raw';
	import svgUserCircleSolid from 'assets/icons/user-circle-solid.svg?raw';
	import { onMount } from 'svelte';
	import { Size } from 'types';
		onMount(async () => {
			await import('ui');
		});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<Container>
	<h1>Settings</h1>
</Container>
<Container>
	<fieldset>
		<legend>
			Account
		</legend>
		<div class="fd-card">
			<div class="fd-stack">
				<SettingsItem>
					<Icon slot="icon" size={Size.Xl}>
						{@html svgAtSolid}
					</Icon>
					<div slot="input">
						<fd-switch name="stayLoggedIn">
							<fd-label>Angemeldet bleiben</fd-label>
						</fd-switch>
					</div>
				</SettingsItem>
				<SettingsItem>
					<Icon slot="icon" size={Size.Xl}>
						{@html svgAtSolid}
					</Icon>
					<InputWrapper id="email">
						<svelte:fragment slot="label">E-Mail</svelte:fragment>
						<input class="fd-input" slot="input" type="email" placeholder="example@mail.de" />
					</InputWrapper>
				</SettingsItem>
			</div>
		</div>
	</fieldset>
</Container>

<style lang="postcss">
	/* @todo add class to Container and replace */
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

	input {
		inline-size: 100%;
	}
</style>
