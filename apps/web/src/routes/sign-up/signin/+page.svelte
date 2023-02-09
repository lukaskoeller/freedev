<script lang="ts">
	import SignInForm from "$lib/signinform/SignInForm.svelte";
  import FormContainer from "../FormContainer.svelte";

  const heading: string = 'Seat belts on!';
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <SignInForm></SignInForm>
</FormContainer>