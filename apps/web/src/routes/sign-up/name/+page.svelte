<script lang="ts">
	import { onMount } from "svelte";
	import FormContainer from "../FormContainer.svelte";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What should we call you?';
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-name"
    method="POST"
  >
    <div class="fd-stack">
      <fd-input
        name="handle"
        type="text"
        label="handle"
        required
      ></fd-input>
      <fd-input
        name="firstName"
        type="text"
        label="First Name"
        required
      ></fd-input>
      <fd-input
        name="lastName"
        type="text"
        label="Last Name"
        required
      ></fd-input>
    </div> 
  </form>
  <fd-button
    slot="footer"
    form="sign-up-name"
    expand
  >
    Continue
  </fd-button>
</FormContainer>