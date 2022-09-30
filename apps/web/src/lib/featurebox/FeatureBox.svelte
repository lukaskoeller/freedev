<script lang="ts">
  export const heading: string = undefined;
</script>

<div class="fd-stack">
  {#if $$slots.figure}
    <div class="figure">
      <slot name="figure"></slot>
    </div>
  {/if}
  <h4>{heading}</h4>
  <p>
    <slot></slot>
  </p>
</div>
<style lang="postcss">
  .fd-stack {
    grid-column: span var(--fd-feature-box-grid-column-span);
  }
</style>