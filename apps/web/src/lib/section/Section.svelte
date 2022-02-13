<script lang="ts">
  import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });

  export let heading: string;
</script>

<section>
  <div class="header">
    <h2>{heading}</h2>
    <fd-label>Read More</fd-label>
  </div>
  <slot />
</section>

<style lang="postcss">
  section {
    display: grid;
    gap: var(--size-3);
    padding: var(--global-spacing);
  }

  .header {
    inline-size: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  h2 {
    font-size: var(--font-size-fluid-2);
    font-weight: var(--font-weight-5);
    color: var(--primary-color-base);
  }

  fd-label {
    --fd-label-font-size: var(--font-size-fluid-0);
  }
</style>