<script lang="ts">
  export let text: string = '';
</script>

<div>
  <div class="fd-input-group">
    <slot></slot>
  </div>
  {#if $$slots.text || text}
    <div
      class="fd-error fd-caption"
      role="alert"
    >
      <slot name="text">
        {text}
      </slot>
    </div>
  {/if}
</div>