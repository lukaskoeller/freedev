<div>
  <slot />
</div>

<style lang="postcss">
  div {
    display: grid;
    gap: var(--fd-stack-gap, var(--size-3));
    justify-items: var(--fd-stack-justify-items, stretch);
  }
</style>