<script lang="ts">
  export let id: string;
  export let name: string;
  export let label: string;
</script>

<label for={id} class="fd-checkbox-button">
  <input
    type="checkbox"
    {name}
    {id}
  >
  <div>{label}</div>
</label>