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
<section class="settingsWrapper">
	<fd-card class="settings">
		<fd-section class="separator" fullWidth={true} hasBorder={true}>
			<div class="sectionSlot">
				<div class="sectionIcon">
					<fd-icon size="xl" file={svgAtSolid} />
				</div>
				<fd-input type="email">E-Mail</fd-input>
			</div>
		</fd-section>
		<fd-section class="separator" fullWidth={true} hasBorder={true}>
			<div class="sectionSlot">
				<div class="sectionIcon">
					<fd-icon size="xl" file={svgUserCircleSolid} />
				</div>
				<fd-input>Name</fd-input>
			</div>
		</fd-section>
	</fd-card>
</section>

<style lang="postcss">
	.settingsWrapper {
		inline-size: 100%;
		display: flex;
		justify-content: center;
	}
	.settings::part(card) {
		display: grid;
		gap: var(--size-8);

		margin-inline: auto;
		margin-block: var(--global-spacing);
		inline-size: 50vw;
	}

	.settings fd-section {
		&:first-child::part(hr) {
			display: none;
		}
	}

	.separator {
		--fd-section-padding-block: 0;
	}

	.sectionSlot {
		display: flex;

		& fd-input {
			inline-size: 100%;
		}
	}

	.sectionIcon {
		flex-shrink: 0;
		inline-size: var(--global-spacing);
	}
</style>
