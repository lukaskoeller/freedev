<script lang="ts">
	import Icon from "$lib/icon/Icon.svelte";
	import timesSolidSvg from "assets/icons/times-solid.svg?raw";
	import { Size } from "types";

  export let message: string;
</script>

<div class="toast fd-card">
  {#if $$slots.before}
    <div class="before">
      <slot name="before"></slot>
    </div>
  {/if}
  <div class="main">
    <strong>{message}</strong>
    {#if $$slots.body}
      <div class="body">
        <slot name="body"></slot>
      </div>
    {/if}
  </div>
  <div class="after">
    <slot name="after">
      <Icon size={Size.Xs}>{@html timesSolidSvg}</Icon>
    </slot>
  </div>
</div>

<style lang="postcss">
  .toast {
    --fd-card-padding-inline: var(--size-4);
    --fd-card-padding-block: var(--size-3);

    display: flex;
    gap: var(--size-4);
    inline-size: min(var(--size-15), 100%);
  }

  .main {
    flex-grow: 1;
  }

  strong {
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-3);
  }

  .before {
    flex-shrink: 0;
  }

  .after {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    block-size: calc(var(--font-size-1) * var(--font-lineheight-3))
  }

  .main {
    display: grid;
    gap: var(--size-1);
  }
</style>