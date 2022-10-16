<script lang="ts">
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
      x
    </slot>
  </div>
</div>

<style lang="postcss">
  .toast {
    --fd-card-padding-inline: var(--size-4);
    --fd-card-padding-block: var(--size-4);

    display: flex;
    gap: var(--size-4);
  }

  .main {
    display: grid;
    gap: var(--size-1);
  }
</style>