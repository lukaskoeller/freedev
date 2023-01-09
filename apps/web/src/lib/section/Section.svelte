<script lang="ts">
  export let heading: string;
  export let isEndAligned: boolean = false;
</script>

<section data-is-end-aligned={isEndAligned}>
  <div class="header">
    {#if heading}
      <h2>{heading}</h2>
      {#if $$slots.actions}
        <slot name="actions"></slot>
      {/if}
    {/if}
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
    color: var(--color-primary-base);
  }

  fd-label {
    --fd-label-font-size: var(--font-size-fluid-0);
  }

  .slot {
    padding-inline-start: var(--padding-inline-start, var(--padding-inline-default));
    padding-inline-end: var(--padding-inline-end, var(--padding-inline-default));
  }
</style>