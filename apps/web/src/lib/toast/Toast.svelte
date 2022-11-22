<script lang="ts">
	import Icon from "$lib/icon/Icon.svelte";
	import timesSolidSvg from "assets/icons/times-solid.svg?raw";
	import { fly } from "svelte/transition";
	import { Size } from "types";
	import { NotificationType } from "./notifications";
  import checkCircleSvg from 'assets/icons/check-circle-solid.svg?raw';
  import exclamationCircleSolidSvg from 'assets/icons/exclamation-circle-solid.svg?raw';
  import timesCircleSvg from 'assets/icons/times-circle.svg?raw';

  export let message: string;
  export let type: NotificationType = NotificationType.Default;
</script>

<div
  class="toast fd-card"
  data-variant="inverted"
  transition:fly={{ y: 30 }}
>
  {#if $$slots.before || type}
    <div class="before">
      <slot name="before">
        {#if type === NotificationType.Success}
          <Icon
            size={Size.Md}
            --fd-icon-fill="var(--color-status-success)"
          >{@html checkCircleSvg}</Icon>
        {:else if type === NotificationType.Warning}
          <Icon
            size={Size.Md}
            --fd-icon-fill="var(--color-status-warning)"
          >{@html exclamationCircleSolidSvg}</Icon>
        {:else if type === NotificationType.Danger}
          <Icon
            size={Size.Md}
            --fd-icon-fill="var(--color-status-error)"
          >{@html exclamationCircleSolidSvg}</Icon>
        {:else if type === NotificationType.Error}
          <Icon
            size={Size.Md}
            --fd-icon-fill="var(--color-status-error)"
          >{@html timesCircleSvg}</Icon>
        {/if}
      </slot>
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