<script lang="ts">
	import Section from '$lib/section/Section.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SkillCard from '$lib/skillcard/SkillCard.svelte';

  onMount(async () => {
    await import('ui');
  });

  export let data: PageData;
	console.log(data);

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
			<button class="fd-button">Scedule</button>
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
			<button class="fd-button" data-variant="stealth" data-size="sm">Read More</button>
		</div>
		<div class="skills fd-ram-grid">
			{#each Object.entries(data.skills) as [category, skills] (category)}
				<SkillCard items={skills} heading={category} />
			{/each}
		</div>
	</Section>
	<Section heading="About Me">
		<div slot="actions">
			<button class="fd-button" data-size="sm">Edit</button>
			<button class="fd-button" data-size="sm">Read More</button>
		</div>
		<p>
			Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
			ut labore et dolore magna aliquyam erat, sed diam voluptua.
		</p>
	</Section>
	<Section heading="Projects" fullWidth={true}>
		<ul
			class="fd-gallery"
			style="--fd-gallery-gap: var(--fd-section-padding-inline)"
		>
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

	.skills {
		--fd-ram-grid-min-width: calc(var(--size-15) * 0.75);

		/* display: flex;
		flex-wrap: wrap;
		gap: var(--size-fluid-1); */
		/* align-items: stretch; */
	}

	.project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--color-surface-2);
		border-radius: var(--border-size-3);
	}
</style>
