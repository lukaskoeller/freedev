<script lang="ts">
	import type { Size } from "types";

  export let size: Size = undefined;
  export let align: 'start' | 'center' | 'end' = undefined;
  export let style: string = undefined;
</script>

<section data-size={size} data-align={align} {style}>
  <slot />
</section>

<style lang="postcss">
  section {
    --_fd-container-padding-inline: var(--fd-container-padding-inline, var(--global-spacing));
    --_fd-container-padding-block: var(--fd-container-padding-block, var(--global-spacing));

    @media (--tablet) {
      --_fd-container-padding-block: var(--fd-container-padding-block, calc(var(--global-spacing) / 2));
    }

    --_fd-container-inline-size: var(--fd-container-inline-size, auto);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, 0);

    box-sizing: border-box;
    inline-size: min(var(--_fd-container-inline-size, fit-content), 100%);
    margin-inline: var(--_fd-container-margin-inline);
    padding-inline-start: var(--fd-container-padding-inline-start, var(--_fd-container-padding-inline-start,  var(--_fd-container-padding-inline)));
    padding-inline-end: var(--fd-container-padding-inline-end, var(--_fd-container-padding-inline-end,  var(--_fd-container-padding-inline)));
    padding-block: var(--_fd-container-padding-block);
  }

  section[data-size="xs"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(1 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-size="sm"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(1.5 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-size="md"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(2 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-size="lg"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(2.25 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-size="xl"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(3 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-size="xxl"] {
    --_fd-container-inline-size: var(--fd-container-inline-size, calc(4 * var(--size-15)));
    --_fd-container-padding-inline: var(--fd-container-padding-inline, 0px);
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-align="start"] {
    --_fd-container-margin-inline: var(--fd-container-margin-inline, 0);
    --_fd-container-padding-inline-start: 0;
  }

  section[data-align="center"] {
    --_fd-container-margin-inline: var(--fd-container-margin-inline, auto);
  }

  section[data-align="end"] {
    --_fd-container-margin-inline: var(--fd-container-margin-inline, 0);
    --_fd-container-padding-inline-start: auto;
  }
</style>