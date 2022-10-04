<script lang="ts">
	import Container from '$lib/container/Container.svelte';
	import FeatureBox from '$lib/featurebox/FeatureBox.svelte';
	import ProfileCard from '$lib/profilecard/ProfileCard.svelte';
	import SearchBar from '$lib/searchbar/SearchBar.svelte';
  import { onMount } from 'svelte';
	import { Size } from 'types';
  import atWorkImage from '$lib/assets/images/woman-at-work.jpg';
  import workOfficeImage from '$lib/assets/images/work-office.jpeg';
  import lightImage from '$lib/assets/images/light.jpg';
  import netflixLogo from '$lib/assets/images/netflix-logo.png';
  import redditLogo from '$lib/assets/images/reddit-logo.png';
  import veoliaLogo from '$lib/assets/images/veolia-logo.png';
  import bookingLogo from '$lib/assets/images/booking-logo.png';
  import braveLogo from '$lib/assets/images/brave-logo.png';

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
    <fd-gallery style="--fd-gallery-gap: var(--size-fluid-2);">
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
			<fd-gallery-item>
        <ProfileCard></ProfileCard>
      </fd-gallery-item>
		</fd-gallery>
  </Container>
  <Container>
    <Container size={Size.Lg}>
      <div class="fd-ram-grid feature-grid">
        <FeatureBox heading="Vernetzt mit dem Payments-Epizentrum" --fd-feature-box-grid-column-span="2">
          <div slot="figure">XXX</div>
          Ob direkte Integrationen mit Kartennetzwerken und Banken oder Bezahlvorgänge im Browser, Stripe-Technologien bewirken Großes im gesamten Tech-Stack der Finanzwelt.
        </FeatureBox>
        <FeatureBox heading="Vernetzt mit dem Payments-Epizentrum">
          <div slot="figure">XXX</div>
          Ob direkte Integrationen mit Kartennetzwerken und Banken oder Bezahlvorgänge im Browser, Stripe-Technologien bewirken Großes im gesamten Tech-Stack der Finanzwelt.
        </FeatureBox>
        <FeatureBox heading="Vernetzt mit dem Payments-Epizentrum">
          <div slot="figure">XXX</div>
          Ob direkte Integrationen mit Kartennetzwerken und Banken oder Bezahlvorgänge im Browser, Stripe-Technologien bewirken Großes im gesamten Tech-Stack der Finanzwelt.
        </FeatureBox>
      </div>
    </Container>
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
    inline-size: 100%;
    block-size: max(54vh);
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

  .feature-grid {
    --fd-ram-grid-min-width: var(--size-13);
    --fd-ram-grid-gap: var(--size-6);
    align-items: start;
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