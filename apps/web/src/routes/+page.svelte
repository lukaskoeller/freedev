<script lang="ts">
	import Container from '$lib/container/Container.svelte';
	import SearchBar from '$lib/searchbar/SearchBar.svelte';
  import { onMount } from 'svelte';
	import { Size } from 'types';

  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
  <Container>
    <div class="hero">
      <div class="center">
        <h1>Freelancing — the right way</h1>
        <SearchBar />
      </div>
    </div>
  </Container>
  <Container style="--fd-container-padding-inline: 0px;">
    <fd-gallery style="--fd-gallery-gap: var(--size-fluid-3);">
			<fd-gallery-item>
        <fd-card>
          Lukas Köller
        </fd-card>
      </fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
			<fd-gallery-item class="project-preview"></fd-gallery-item>
		</fd-gallery>
  </Container>
  <Container>
    <fd-button href="/sign-up">Sign Up</fd-button>
  </Container>
</section>

<style lang="postcss">
  .hero {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--size-fluid-2);
    inline-size: 100%;
    block-size: max(60vh);
    /* aspect-ratio: 5/4; */
    border-radius: var(--radius-conditional-3);
    /* background: radial-gradient(var(--color-surface-1) -20%, var(--color-primary-7) 240%); */
    /* background: linear-gradient(var(--color-primary-7) -20%, var(--color-primary-8)); */
    /* background: hsla(var(--color-accent-hue), 26%, 93%, 0.5);
    backdrop-filter: blur(16px);
    box-shadow: var(--shadow-3); */

    & h1 {
      text-align: center;
      font-size: var(--font-size-fluid-3);
      /* background: linear-gradient(var(--color-surface-1), var(--color-accent-5));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; */
    }

    @media (--tablet) {
      aspect-ratio: 2.4/1;
    }
  }

  .center {
    display: grid;
    gap: var(--size-fluid-4);
  }

  .project-preview {
		aspect-ratio: 4/5;
		inline-size: min(50vw, var(--size-14));
		background-color: var(--color-surface-2);
		border-radius: var(--border-size-3);
	}
</style>