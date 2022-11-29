<script lang="ts">
	import Icon from '$lib/icon/Icon.svelte';
  import { onMount } from 'svelte';
  import svgTimesSolid from 'assets/icons/times-solid.svg?raw';
	import { Size } from 'types';

  export let id: string;
  let dialogElement: HTMLDialogElement;

  onMount(async () => {
    await import('ui');
    const {
      dialogAttrObserver,
      dialogDeleteObserver,
      lightDismiss,
      dialogClose,
    } = await import('./modal');

    dialogElement.addEventListener('click', lightDismiss);
    dialogElement.addEventListener('close', dialogClose);

    dialogAttrObserver.observe(dialogElement, { attributes: true });
    dialogDeleteObserver.observe(document.body, {
      attributes: false,
      subtree: false,
      childList: true,
    })
  });
</script>

<dialog
  {id}
  class="fd-card"
  inert
  bind:this={dialogElement}
>
  <form method="dialog">
    <header>
      <div class="heading">
        <slot name="heading"></slot>
      </div>
      <fd-button variant="icon" size={Size.Sm}>
        <Icon size={Size.Sm}>{@html svgTimesSolid}</Icon>
      </fd-button>
    </header>
    <div class="main">
      <slot></slot>
    </div>
    <footer>Close</footer>
  </form>
</dialog>

<style lang="postcss">
  dialog {
    --_dialog-padding-inline: var(
      --dialog-padding-inline,
      min(var(--_fd-card-padding-inline), var(--size-6))
    );
    --_dialog-padding-block: var(--dialog-padding-block, var(--size-3));
    --_dialog-margin-inline: var(--dialog-margin-inline, var(--size-2));

    display: grid;
    max-inline-size: calc(
      min(100%, var(--size-content-3))
      - (var(--_dialog-margin-inline) * 2)
    );
    max-block-size: min(80vh, 100%);
    max-block-size: min(80dvb, 100%);
    margin: auto;
    margin-inline: var(--_dialog-margin-inline);
    margin-block-end: 0;
    padding: 0;
    position: fixed;
    inset: 0;
    border-radius: var(--radius-3);
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    z-index: var(--layer-important);
    overflow: hidden;
    transition: opacity .5s var(--ease-3);

    &:not([open]) {
      pointer-events: none;
      opacity: 0;
    }

    &::backdrop {
      transition: backdrop-filter .5s ease;
      backdrop-filter: blur(25px);
    }

    @media (--large-mobile) {
      --_dialog-padding-block: var(--dialog-padding-block, var(--size-5));

      margin: auto;
      border-radius: var(--radius-3);
      
      @media (--motionOK) {
        animation: var(--animation-slide-out-down) forwards;
        animation-timing-function: var(--ease-squish-2);
      }
    }
  }

  form {
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: start;
    justify-items: stretch;

    & > * {
      padding-inline: var(--_dialog-padding-inline);
    }
  }

  header {
    display: flex;
    gap: var(--size-3);
    justify-content: space-between;
    align-items: center;
    padding-block: var(--_dialog-padding-block);
    padding-inline: var(--_dialog-padding-inline);
    /* border-bottom: var(--border-size-1) solid var(--color-border); */
  }

  :global(.heading :--heading) {
    font-size: var(--font-size-4);

    @media (--large-mobile) {
      font-size: var(--font-size-5);
    }
  }

  .main {
    padding-inline: var(--_dialog-padding-inline);
    padding-block: var(--_dialog-padding-block);
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
    justify-content: space-between;
    align-items: flex-start;
    padding-inline: var(--_dialog-padding-inline);
    padding-block: var(--size-3);
  }
</style>