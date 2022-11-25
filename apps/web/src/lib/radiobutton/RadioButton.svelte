<script lang="ts">
  export let name: string;
  export let id: string;
  export let value: string;
  export let label: string;
</script>

<label for={id} class="fd-radio-button">
  <input
    type="radio"
    {name}
    {id}
    {value}
  >
  <div>{label}</div>
</label>