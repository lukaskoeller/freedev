<script lang="ts">
	import { onMount } from "svelte";
	import FormContainer from "../FormContainer.svelte";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What are your conditions?';
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-conditions"
    method="POST"
  >
    <div class="fd-stack">
      <fd-input
        name="hourlyRate"
        type="number"
        label="Hourly Rate"
        required
      ></fd-input>
      <fd-input
        name="availableFrom"
        type="date"
        label="Available From"
        required
      ></fd-input>
      <fd-input
        name="capacity"
        type="text"
        label="Capacity"
        required
      ></fd-input>
    </div> 
  </form>
  <fd-button
    slot="footer"
    form="sign-up-conditions"
    expand
  >
    Continue
  </fd-button>
</FormContainer>