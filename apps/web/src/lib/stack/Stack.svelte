<div>
  <slot />
</div>

<style lang="postcss">
  div {
    --fd-stack-gap: var(--size-3);
    --fd-stack-justify-items: stretch;

    display: grid;
    gap: var(--fd-stack-gap);
    justify-items: var(--fd-stack-justify-items);
  }
</style>