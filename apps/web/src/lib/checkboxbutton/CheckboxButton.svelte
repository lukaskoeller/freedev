<script lang="ts">
  export let id: string;
</script>

<label for={id} class="fd-checkbox-button">
  <slot></slot>
  <div class="label">
    <slot name="label"></slot>
  </div>
</label>