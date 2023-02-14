<script lang="ts">
  export let heading: string = null;
  export let fullWidth: boolean = false;
  export let isEndAligned: boolean = false;
  export let hasBorder: boolean = false;
</script>

<section
  class="fd-section"
  data-is-end-aligned={isEndAligned}
  data-full-width={fullWidth}
>
  {#if hasBorder}
    <hr class="fd-hr" />
  {/if}
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
  :global(.fd-section) {
    --_fd-section-padding-inline: var(
      --fd-section-padding-inline,
      var(--global-spacing)
    );
  }

  .fd-hr {
    --fd-hr-padding-inline: var(--_fd-section-padding-inline);
    --fd-hr-margin-inline-start: var(--_fd-section-padding-inline);
  }

  section {
    display: grid;
    gap: var(--size-3);
    grid-template-columns: minmax(0, 1fr);
    padding-block: var(--global-spacing);

    &[data-is-end-aligned="true"] {
      --fd-section-padding-inline-end: 0;
    }
  }

  section[data-full-width="true"] {
      --_fd-section-padding-inline-start: 0;
      --_fd-section-padding-inline-end: 0;
    }

  .header {
    inline-size: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    padding-inline: var(--_fd-section-padding-inline);
  }

  h2 {
    font-size: var(--font-size-fluid-2);
    font-weight: var(--font-weight-5);
    color: var(--color-primary-base);
  }

  .slot {
    padding-inline-start: var(
      --fd-section-padding-inline-start,
      var(
        --_fd-section-padding-inline-start,
        var(
          --fd-section-padding-inline,
          var(--_fd-section-padding-inline)
        )
      )
    );
    padding-inline-end: var(
      --fd-section-padding-inline-end,
      var(
        --_fd-section-padding-inline-end,
        var(
          --fd-section-padding-inline,
          var(--_fd-section-padding-inline)
        )
      )
    );
  }
</style>