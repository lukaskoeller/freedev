<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	// import Counter from '$lib/Counter.svelte';
	import Section from '$lib/section/Section.svelte';
import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<div class="header">
		<div class="avatar"></div>
		<div class="base-info">
			<div class="base-title">
				<h4>Lukas Köller</h4>
				<div>React Frontend Developer</div>
			</div>
			<fd-button size="small">Scedule</fd-button>
		</div>
	</div>
	<fd-section class="separator" fullWidth={true} hasBorder={true}>
		<fd-gallery style="--fd-gallery-gap: var(--fd-section-padding-inline)">
			<fd-gallery-item class="kpi">
				<fd-label tag="div">Hourly Rate</fd-label>
				<span>123 €</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label tag="div">Available From</fd-label>
				<span>Feb 12</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label tag="div">Projects</fd-label>
				<span>42</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label tag="div">Happiness</fd-label>
				<span>4.3 (27)</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label tag="div">Capacity</fd-label>
				<span>30h/week</span>
			</fd-gallery-item>
		</fd-gallery>
	</fd-section>
	<fd-section heading="About Me">
		Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
		ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
		dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
	</fd-section>
	<fd-section heading="Projects" fullWidth={true}>
		<fd-gallery style="--fd-gallery-gap: var(--fd-section-padding-inline)">
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
		</fd-gallery>
	</fd-section>
</section>

<style lang="postcss">
	.header {
		display: flex;
		gap: var(--size-7);
		padding-block: var(--size-5);
		padding-inline: var(--global-spacing);
	}

	.base-info {
		display: grid;
		gap: var(--size-5);
		padding-block-start: var(--size-1);
	}

	.base-title {
		& > h4 {
			font-size: var(--font-size-fluid-2);
			font-weight: var(--font-weight-6);
			color: var(--primary-color-base);
		}

		& > div {
			font-weight: var(--font-weight-5);
			color: var(--primary-color-3);
		}
	}

	.avatar {
		--size: min(100px, 40vw);
		aspect-ration: 1/1;
		inline-size: var(--size);
		block-size: var(--size);
		border-radius: 100%;
		background-color: var(--primary-color-1);
	}

	fd-gallery {
		& .kpi {
			text-align: center;
		}

		& fd-label {
			--fd-label-font-size: var(--font-size-fluid-0);
		}
	}

	.project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--primary-color-1);
		border-radius: var(--border-size-3);
	}
</style>
