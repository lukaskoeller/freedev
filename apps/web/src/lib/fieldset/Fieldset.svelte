<script lang="ts">
  export let legend: string;
  export let variant: 'light' = undefined;
</script>

<fieldset data-variant={variant}>
  <legend>{legend}</legend>
  <slot></slot>
</fieldset>

<style lang="postcss">
  fieldset[data-variant="light"] {
    padding-inline: 0;
    border: 0;
  }
</style>