<script lang="ts">
	import { onMount } from "svelte";
	import FormContainer from "../FormContainer.svelte";

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What do you rock at?';
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-skills"
    method="POST"
  >
    <div class="fd-stack">
      <fd-input
        name="programmingLanguages"
        type="text"
        label="Languages"
        required
      ></fd-input>
      <fd-input
        name="stack"
        type="text"
        label="Stack"
        required
      ></fd-input>
      <fd-input
        name="tools"
        type="text"
        label="Tools"
        required
      ></fd-input>
    </div> 
  </form>
  <fd-button
    slot="footer"
    form="sign-up-skills"
    expand
  >
    Go to profile
  </fd-button>
</FormContainer>