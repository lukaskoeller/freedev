<script lang="ts">
	import Container from '$lib/container/Container.svelte';
	import FeatureBox from '$lib/featurebox/FeatureBox.svelte';
	import FeatureSection from '$lib/featuresection/FeatureSection.svelte';
	import ProfileCard from '$lib/profilecard/ProfileCard.svelte';
	import SearchBar from '$lib/searchbar/SearchBar.svelte';
	import { Size } from 'types';
  import atWorkImage from '$lib/assets/images/woman-at-work.jpg';
  import workOfficeImage from '$lib/assets/images/work-office.jpeg';
  import lightImage from '$lib/assets/images/light.jpg';
  import netflixLogo from '$lib/assets/images/netflix-logo.png';
  import redditLogo from '$lib/assets/images/reddit-logo.png';
  import veoliaLogo from '$lib/assets/images/veolia-logo.png';
  import bookingLogo from '$lib/assets/images/booking-logo.png';
  import braveLogo from '$lib/assets/images/brave-logo.png';
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
  <Container>
    <Container size={Size.Md}>
      <div class="used-by">
        <img class="used-by-item" src={bookingLogo} width="80px" height="14px" alt="xyz is using freedev">
        <img class="used-by-item" src={netflixLogo} width="80px" height="34px" alt="xyz is using freedev">
        <img class="used-by-item" src={braveLogo} width="80px" height="25px" alt="xyz is using freedev">
        <img class="used-by-item" src={veoliaLogo} width="80px" height="20px" alt="xyz is using freedev">
        <img class="used-by-item" src={redditLogo} width="80px" height="37px" alt="xyz is using freedev">
      </div>
    </Container>
  </Container>
  <Container style="--fd-container-padding-inline: 0px;">
    <ul class="fd-gallery" style="--fd-gallery-gap: var(--size-fluid-2);">
			<li>
        <ProfileCard></ProfileCard>
      </li>
			<li>
        <ProfileCard></ProfileCard>
      </li>
			<li>
        <ProfileCard></ProfileCard>
      </li>
			<li>
        <ProfileCard></ProfileCard>
      </li>
			<li>
        <ProfileCard></ProfileCard>
      </li>
			<li>
        <ProfileCard></ProfileCard>
      </li>
		</ul>
  </Container>
  <Container>
    <Container size={Size.Lg}>
      <FeatureSection>
        <figure>
          <img src={atWorkImage} width="358" height="286" alt="Time management is easy with freedev">
        </figure>
        <div class="fd-stack">
          <h2>Alles auf einer Plattform. Alles in wenigen Minuten.</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        </div>
      </FeatureSection>
    </Container>
  </Container>
  <Container>
    <Container size={Size.Lg}>
      <div class="fd-ram-grid feature-grid">
        <FeatureBox heading="Integrations">
          <div slot="figure">XXX</div>
          DATEV, Slack, Microsoft Teams, Outlook, Gitlab, Github, Personio...
        </FeatureBox>
        <FeatureBox heading="Integrations">
          <div slot="figure">XXX</div>
          DATEV, Slack, Microsoft Teams, Outlook, Gitlab, Github, Personio...
        </FeatureBox>
        <FeatureBox heading="Einfaches Management">
          <div slot="figure">XXX</div>
          Vertragsmanagement, Zeitmanagement, Verschwiegenheitsvereinbarung (NDA) ...
        </FeatureBox>
        <FeatureBox heading="Risikoübernahme">
          <div slot="figure">XXX</div>
          Risiken wegen Scheinselbstständigkeit übernehmen wir als Plattform...
        </FeatureBox>
      </div>
    </Container>
  </Container>
  <Container>
    <Container size={Size.Lg}>
      <FeatureSection>
        <div class="fd-stack">
          <h2>Alles auf einer Plattform. Alles in wenigen Minuten.</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        </div>
        <figure>
          <img src={workOfficeImage} width="358" height="239" alt="freedev freelancer in office">
        </figure>
      </FeatureSection>
    </Container>
  </Container>
  <Container>
    <Container size={Size.Lg}>
      <FeatureSection>
        <figure>
          <img src={lightImage} width="358" height="239" alt="freedev makes managing freelancers easy">
        </figure>
        <div class="fd-stack">
          <h2>Alles auf einer Plattform. Alles in wenigen Minuten.</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        </div>
      </FeatureSection>
    </Container>
  </Container>
  <Container>
    <a class="fd-button" href="/sign-up">Sign Up</a>
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

    @media (--md-n-above) {
      aspect-ratio: 2.4/1;
    }
  }

  .used-by {
    display: flex;
    gap: var(--size-3);
    justify-content: center;
    align-items: center;
    overflow: hidden;
    flex-wrap: wrap;

    @media (--md-n-above) {
      gap: var(--size-9);
    }
  }

  .used-by-item {
    inline-size: clamp(var(--size-10), 7vw, var(--size-12));
  }

  figure img {
    border-radius: var(--radius-2);
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