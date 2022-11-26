<script lang="ts">
  export let id: string = undefined;
</script>

<label for={id} class="fd-radio-button">
  <slot></slot>
  <div><slot name="label"></slot></div>
</label>