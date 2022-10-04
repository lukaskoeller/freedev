<section class="fd-ram-grid">
  <slot></slot>
</section>

<style lang="postcss">
  .fd-ram-grid {
    --fd-ram-grid-min-width: var(--size-14);
    --fd-ram-grid-gap: var(--size-6);

    @media (--tablet) {
      --fd-ram-grid-gap: var(--size-9);
    }
  }
</style>