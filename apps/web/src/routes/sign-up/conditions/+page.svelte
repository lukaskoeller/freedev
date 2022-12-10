<script lang="ts">
	import CheckboxButton from "$lib/checkboxbutton/CheckboxButton.svelte";
	import Fieldset from "$lib/fieldset/Fieldset.svelte";
	import RadioButton from "$lib/radiobutton/RadioButton.svelte";
import { onMount } from "svelte";
	import FormContainer from "../FormContainer.svelte";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What are your conditions?';
  let capacity: string;
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
      <Fieldset legend="Capacity">
        <div class="fd-stack">
          <div class="fd-input-group">
            <RadioButton>
              <input
                type="radio"
                name="test"
                id="sixteen"
                value="16h/week"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">16h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="test"
                id="thirty"
                value="30h/week"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">30h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="test"
                id="forty"
                value="40h/week"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">40h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="test"
                id="fifty"
                value="custom"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">Custom</svelte:fragment>
            </RadioButton>
          </div>
          {#if capacity === 'custom'}
            <fd-input
              name="customCapacity"
              type="number"
              label="Custom Capacity"
              required
            ></fd-input>
          {/if}
        </div>
      </Fieldset>
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