<script lang="ts">
  import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });

  export let heading: string;
  export let isEndAligned: boolean = false;
</script>

<section data-is-end-aligned={isEndAligned}>
  <div class="header">
    <h2>{heading}</h2>
    <fd-label>Read More</fd-label>
  </div>
  <div class="slot">
    <slot />
  </div>
</section>

<style lang="postcss">
  section {
    display: grid;
    gap: var(--size-3);
    grid-template-columns: minmax(0, 1fr);
    padding-block: var(--global-spacing);

    --padding-inline-default: var(--padding-inline, var(--global-spacing));

    &[data-is-end-aligned="true"] {
      --padding-inline-end: 0;
    }
  }

  .header {
    inline-size: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    padding-inline: var(--padding-inline-default);
  }

  h2 {
    font-size: var(--font-size-fluid-2);
    font-weight: var(--font-weight-5);
    color: var(--primary-color-base);
  }

  fd-label {
    --fd-label-font-size: var(--font-size-fluid-0);
  }

  .slot {
    padding-inline: var(--padding-inline-default);
    padding-inline-end: var(--padding-inline-end, var(--padding-inline-default));
  }
</style>