<script lang="ts">
  export let legend: string;
</script>

<fieldset>
  <legend>{legend}</legend>
  <slot></slot>
</fieldset>