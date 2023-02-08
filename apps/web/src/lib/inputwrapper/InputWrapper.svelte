<script lang="ts">
  export let id: string;
  export let text: string = '';
</script>

<div class="container">
  <label class="fd-label" for={id}>
    <slot name="label"></slot>
  </label>
  <slot></slot>
  <div
    class="fd-error fd-caption"
    role="alert"
    id="error"
  >
    <slot name="error">
      {text}
    </slot>
  </div>
</div>

<style lang="postcss">
  .container {
    display: grid;
    row-gap: calc(var(--size-1) / 2);
  }
</style>
