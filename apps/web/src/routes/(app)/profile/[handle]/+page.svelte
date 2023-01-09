<script lang="ts">
	import Container from '$lib/container/Container.svelte';
	import Section from '$lib/section/Section.svelte';
	import { onMount } from 'svelte';
	import { Size } from 'types';
	import type { PageData } from './$types';
	import svgReact from 'assets/icons/react.svg?raw';

  onMount(async () => {
    await import('ui');
  });

  export let data: PageData;
	const {
		firstName,
		lastName,
		handle,
		hourlyRate,
		availableFrom,
		capacity,
	} = data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<section>
	<div class="header">
		<div class="avatar"></div>
		<div class="base-info">
			<div class="base-title">
				<h4>{`${firstName} ${lastName}`}</h4>
				<div>/{handle}</div>
			</div>
			<fd-button>Scedule</fd-button>
		</div>
	</div>
	<fd-section class="separator" fullWidth={true} hasBorder={true}>
		<fd-gallery style="--fd-gallery-gap: var(--fd-section-padding-inline)">
			<fd-gallery-item class="kpi">
				<fd-label as="div">Hourly Rate</fd-label>
				<span>{parseFloat(hourlyRate).toLocaleString(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label as="div">Available From</fd-label>
				<span>{new Date(availableFrom).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label as="div">Projects</fd-label>
				<span>42</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label as="div">Happiness</fd-label>
				<span>4.3 (27)</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label as="div">Capacity</fd-label>
				<span>{capacity}h/week</span>
			</fd-gallery-item>
		</fd-gallery>
	</fd-section>
	<Section heading="Skills">
		<div slot="actions">
			<fd-button variant="stealth" size="sm">Read More</fd-button>
		</div>
		<div class="skills-container">
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				React
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				Svelte
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				React Router
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				Deno
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				Go
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				HTML5
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				CSS3
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				Redux Saga
			</div>
			<div class="fd-card skills-card" data-size="sm">
				<fd-icon file={svgReact}></fd-icon>
				Gatsby
			</div>
		</div>
	</Section>
	<fd-section heading="About Me">
		<div slot="actions">
			<fd-button size="sm">Edit</fd-button>
			<fd-button size="sm">Read More</fd-button>
		</div>
		<p>
			Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
			ut labore et dolore magna aliquyam erat, sed diam voluptua.
		</p>
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
	.box {
		max-inline-size: var(--size-content-3);
	}
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
			color: var(--color-primary-base);
		}

		& > div {
			font-weight: var(--font-weight-5);
			color: var(--text-2);
		}
	}

	.avatar {
		--size: min(100px, 40vw);
		aspect-ratio: 1/1;
		inline-size: var(--size);
		block-size: var(--size);
		border-radius: 100%;
		background-color: var(--color-surface-2);
	}

	div[slot="actions"] {
		display: flex;
		gap: var(--size-2);
	}

	fd-gallery {
		& .kpi {
			text-align: center;
		}

		& fd-label {
			--fd-label-font-size: var(--font-size-fluid-0);
		}

		& span {
			font-size: var(--font-size-4);
			color: var(--color-primary-base);
		}
	}

	.skills-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-fluid-1);
	}

	.skills-card {
		inline-size: auto;
		display: flex;
		align-items: center;
		gap: var(--size-3);
		/* --fd-card-background-color: var(--color-surface-2); */
		font-weight: var(--font-weight-6);
		font-size: var(--font-size-2);
	}

	.project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--color-surface-2);
		border-radius: var(--border-size-3);
	}
</style>
