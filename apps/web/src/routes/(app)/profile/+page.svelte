<script lang="ts">
	import Section from '$lib/section/Section.svelte';
import { onMount } from 'svelte';
	import { Size } from 'types';
	import type { PageData } from './$types';
  onMount(async () => {
    await import('ui');
  });

  export let data: PageData;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<section>
	<div class="header">
		<div class="avatar"></div>
		<div class="base-info">
			<div class="base-title">
				<h4>Lukas Köller</h4>
				<div>{data.email}</div>
			</div>
			<button class="fd-button">Scedule</button>
		</div>
	</div>
	<Section fullWidth={true} hasBorder={true}>
		<ul class="fd-gallery" style="--fd-gallery-gap: var(--_fd-section-padding-inline)">
			<li class="kpi">
				<div class="fd-label">Hourly Rate</div>
				<span>123 €</span>
			</li>
			<li class="kpi">
				<div class="fd-label">Available From</div>
				<span>Feb 12</span>
			</li>
			<li class="kpi">
				<div class="fd-label">Projects</div>
				<span>42</span>
			</li>
			<li class="kpi">
				<div class="fd-label">Happiness</div>
				<span>4.3 (27)</span>
			</li>
			<li class="kpi">
				<div class="fd-label">Capacity</div>
				<span>30h/week</span>
			</li>
		</ul>
	</Section>
	<Section heading="About Me">
		<div slot="actions">
			<button class="fd-button" data-size={Size.Sm}>Edit</button>
			<button class="fd-button" data-size={Size.Sm}>Read More</button>
		</div>
		<p>
			Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
			ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
			dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
		</p>
	</Section>
	<Section heading="Projects" fullWidth={true}>
		<ul class="fd-gallery" style="--fd-gallery-gap: var(--_fd-section-padding-inline)">
			<li class="project-preview"></li>
			<li class="project-preview"></li>
			<li class="project-preview"></li>
			<li class="project-preview"></li>
			<li class="project-preview"></li>
			<li class="project-preview"></li>
			<li class="project-preview"></li>
		</ul>
	</Section>
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
			color: var(--color-primary-base);
		}

		& > div {
			font-weight: var(--font-weight-5);
			color: var(--text-2);
		}
	}

	.avatar {
		--size: min(100px, 40vw);
		aspect-ration: 1/1;
		inline-size: var(--size);
		block-size: var(--size);
		border-radius: 100%;
		background-color: var(--color-surface-2);
	}

	div[slot="actions"] {
		display: flex;
		gap: var(--size-2);
	}

	.fd-gallery {
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

	.project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--color-surface-2);
		border-radius: var(--border-size-3);
	}
</style>
