<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
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
				<div>React Frontend Developer</div>
			</div>
			<fd-button size="small">Scedule</fd-button>
		</div>
	</div>
	<fd-section class="separator" fullWidth={true} hasBorder={true}>
		<fd-gallery style="--fd-gallery-gap: var(--fd-section-padding-inline)">
			<fd-gallery-item class="kpi">
				<fd-label as="div">Hourly Rate</fd-label>
				<span>123 €</span>
			</fd-gallery-item>
			<fd-gallery-item class="kpi">
				<fd-label as="div">Available From</fd-label>
				<span>Feb 12</span>
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
	<h3>Form</h3>
	<form>
    <fd-input label="Input Label" value="hello world" name="demo"></fd-input>
		<button type="submit">Submit</button>
  </form>
	<output></output>
	<script>
		const form = document.querySelector('form');
    const output = document.querySelector('output');

    form.addEventListener('submit', event => {
      event.preventDefault();
      
      const form = event.target;
      console.log('fd-input:', form.demo);

      /** Get all of the form data */
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      console.log(data);
      output.innerHTML = JSON.stringify(data, null, 2);
    });
	</script>
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

	.project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--color-surface-2);
		border-radius: var(--border-size-3);
	}
</style>
