<script lang="ts">
	import type { Size } from "types";

  export let size: Size = undefined;
</script>

<section data-size={size}>
  <slot />
</section>

<style lang="postcss">
  section {
    --fd-container-padding-inline: var(--global-spacing);
    --fd-container-padding-block: calc(var(--global-spacing) / 2);

    --fd-container-inline-size: auto;
    --fd-container-margin-inline: 0;

    box-sizing: border-box;
    inline-size: min(var(--fd-container-inline-size, fit-content), 100%);
    margin-inline: var(--fd-container-margin-inline);
    padding-inline-start: var(--fd-container-padding-inline-start, var(--fd-container-padding-inline));
    padding-inline-end: var(--fd-container-padding-inline-end, var(--fd-container-padding-inline));
    padding-block: var(--fd-container-padding-block);
  }

  section[data-size="xs"] {
    --fd-container-inline-size: calc(1 * var(--size-15));
    --fd-container-padding-inline: 0px;
    --fd-container-margin-inline: auto;
  }

  section[data-size="sm"] {
    --fd-container-inline-size: calc(1.5 * var(--size-15));
    --fd-container-padding-inline: 0px;
    --fd-container-margin-inline: auto;
  }

  section[data-size="md"] {
    --fd-container-inline-size: calc(2 * var(--size-15));
    --fd-container-padding-inline: 0px;
    --fd-container-margin-inline: auto;
  }

  section[data-size="lg"] {
    --fd-container-inline-size: calc(3 * var(--size-15));
    --fd-container-padding-inline: 0px;
    --fd-container-margin-inline: auto;
  }

  section[data-size="xl"] {
    --fd-container-inline-size: calc(4 * var(--size-15));
    --fd-container-padding-inline: 0px;
    --fd-container-margin-inline: auto;
  }
</style>