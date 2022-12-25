<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import Fieldset from "$lib/fieldset/Fieldset.svelte";
	import InputGroup from "$lib/inputgroup/InputGroup.svelte";
	import RadioButton from "$lib/radiobutton/RadioButton.svelte";
	import { notifications } from "$lib/toast/notifications";
  import { onMount } from "svelte";
	import type { FieldErrors } from "validations";
	import FormContainer from "../FormContainer.svelte";
	import { validate } from "./_validations";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What are your conditions?';
  let capacity: string;

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-conditions"
    method="POST"
    use:enhance={(props) => {
      isSubmitting = true;
      const { form, data, cancel } = props;
      form.dispatchEvent(new CustomEvent('submitting'));
      const hourlyRate = data.get('hourlyRate');
      const availableFrom = data.get('availableFrom');
      const customCapacity = data.get('customCapacity');

      const formData = {
        hourlyRate,
        availableFrom,
        capacity,
        customCapacity,
      };
      console.log(formData);
      
      
      const { isValid, fields } = validate(formData);
      console.log('fields', fields);
      

      if (!isValid) {
        cancel();
        formErrors = fields;
        isSubmitting = false;
        return;
      }

      return async (args) => {
        console.log({ args });
        const { result, update } = args;
        switch (result.type) {
          case 'success':
            invalidateAll();
            break;
          case 'error':
            notifications.error('Something went wrong 😢');
            form.reset();
            // invalidateAll();
            break;
          case 'invalid':
            notifications.warning(result.data.message);
            // form.reset();
            invalidateAll();
            await applyAction(result);
            break;
          default:
            form.reset();
            invalidateAll();
            await applyAction(result);
            update();
        }
        isSubmitting = false;
      }
    }}
  >
    <div class="fd-stack">
      <fd-input
        name="hourlyRate"
        type="number"
        label="Hourly Rate"
        required
        error={formErrors?.get('hourlyRate')}
      ></fd-input>
      <fd-input
        name="availableFrom"
        type="date"
        label="Available From"
        required
        error={formErrors?.get('availableFrom')}
      ></fd-input>
      <Fieldset legend="Capacity">
        <div class="fd-stack">
          <InputGroup text={formErrors?.get('capacity')}>
            <RadioButton>
              <input
                type="radio"
                name="capacity"
                id="sixteen"
                value="16"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">16h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="capacity"
                id="thirty"
                value="30"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">30h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="capacity"
                id="forty"
                value="40"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">40h/week</svelte:fragment>
            </RadioButton>
            <RadioButton>
              <input
                type="radio"
                name="capacity"
                id="custom"
                value="custom"
                bind:group={capacity}
              >
              <svelte:fragment slot="label">Custom</svelte:fragment>
            </RadioButton>
          </InputGroup>
          {#if capacity === 'custom' || formErrors?.get('customCapacity')}
            <fd-input
              name="customCapacity"
              type="number"
              label="Custom Capacity"
              required
              error={formErrors?.get('customCapacity')}
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