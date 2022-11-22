<script lang="ts">
	import { onMount } from 'svelte';
	onMount(async () => {
    await import('ui');
  });
</script>

<section>
  <header>
    <a href="/">
      <fd-logo />
    </a>
  </header>
  <main>
    <slot></slot>
  </main>
</section>

<style lang="postcss">
  section {
    display: grid;
    grid-template-rows: auto 1fr;
    min-block-size: 100vh;
  }

  header {
    display: grid;
		place-items: center;
		padding-block: var(--size-2);

    @media (--tablet) {
      padding-block: var(--size-3);
    }
  }

  main {
    display: grid;
    align-items: end;

    @media (--tablet) {
      align-items: center;
    }
  }
</style>