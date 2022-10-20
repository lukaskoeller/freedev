<script lang="ts">
	import { Size } from "types";

  const SizeMap = {
    [Size.Xs]: 'var(--size-3)',
    [Size.Sm]: 'var(--size-4)',
    [Size.Md]: 'var(--size-5)',
    [Size.Lg]: 'var(--size-6)',
    [Size.Xl]: 'var(--size-7)',
    'inline': '1em',
  };

  export let size: Size = Size.Md;
</script>

<div style={`--size: ${SizeMap[size]}`}>
  <slot></slot>
</div>

<style lang="postcss">
  div {
    display: contents;
  }

  div :global(svg) {
    inline-size: var(--fd-icon-size, var(--size));
    block-size: var(--fd-icon-size, var(--size));
    display: block;
    transform: translateY(
      var(--fd-icon-offset),
      calc(var(--fd-icon-font-size) * var(--fd-icon-line-height)),
      0px
    );
  }

  div :global(svg) {
    fill: var(--fd-icon-fill, currentColor);
    stroke: var(--fd-icon-fill, currentColor);
  }
</style>