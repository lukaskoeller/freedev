<script lang="ts">
  export let ariaInvalid: boolean = false;

  let confirmationCodeInput: HTMLInputElement;
  let input1Input: HTMLInputElement;

  let input1: string;
  let input2: string;
  let input3: string;
  let input4: string;
  let input5: string;
  let input6: string;

  $: code = `${input1 || ''}${input2 || ''}${input3 || ''}${input4 || ''}${input5 || ''}${input6 || ''}`;

  // Call codeChanged when code changes
  $: code && codeChanged();

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement;

    // Move to next input if current is filled out.
    if (
      target.value !== ''
      && target.nextElementSibling
      && target.nextElementSibling.nodeName === 'INPUT'
    ) {
      (target.nextElementSibling as HTMLInputElement).focus();
    } 
  }

  function onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    // Move to previous input if backspace is clicked
    if (
      e.key === 'Backspace'
      && target.value === ''
      && target.previousElementSibling
      && target.previousElementSibling.nodeName === 'INPUT'
    ) {
      (target.previousElementSibling as HTMLInputElement).focus();
    }
  }

  function codeChanged() {  
    const isFilled = code.length === 6;

    if (isFilled) {
      confirmationCodeInput.value = code;
      const form = confirmationCodeInput.closest('form');
      form?.requestSubmit();
    }
  }

  function onPaste(e: ClipboardEvent) {
    const [
      val1,
      val2,
      val3,
      val4,
      val5,
      val6,
    ] = `${e.clipboardData.getData('text')}`.trim();
    input1 = val1 ?? '';
    input2 = val2 ?? '';
    input3 = val3 ?? '';
    input4 = val4 ?? '';
    input5 = val5 ?? '';
    input6 = val6 ?? '';
  }

  $: ariaInvalid && resetInput();

  function resetInput() {
    input1 = '';
    input2 = '';
    input3 = '';
    input4 = '';
    input5 = '';
    input6 = '';
    input1Input?.focus();
  }
</script>

<div>
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    on:paste={onPaste}
    bind:this={input1Input}
    bind:value={input1}
  >
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    bind:value={input2}
  >
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    bind:value={input3}
  >
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    bind:value={input4}
  >
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    bind:value={input5}
  >
  <input
    type="text"
    maxlength="1"
    aria-label="Ziffer von 1 bis 9"
    aria-invalid={ariaInvalid}
    on:input={onInput}
    on:keydown={onKeyDown}
    bind:value={input6}
  >
</div>
<input
  type="text"
  name="confirmationCode"
  hidden
  inert
  aria-invalid={ariaInvalid}
  bind:this={confirmationCodeInput}
>

<style lang="postcss">
  div {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--size-2);
  }

  input {
    --_fd-input-border-color: var(--fd-input-border-color, var(--color-border));

    min-width: 0;
    padding-block: var(--size-3);
    text-align: center;
    background-color: var(--fd-input-background-color, var(--color-surface-2));
    border: var(--border-size-1) solid var(--_fd-input-border-color);
    border-radius: var(--radius-2);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-5);
    font-size: var(--font-size-fluid-2);
    color: var(--primary-color-base);
  }

  input[aria-invalid="true"] {
    --_fd-input-border-color: var(--color-status-error);
    border: var(--border-size-1) solid var(--_fd-input-border-color);
  }

  input[aria-invalid="false"] {
    --_fd-input-border-color: var(--color-status-success);
    border: var(--border-size-1) solid var(--_fd-input-border-color);
  }

  ::placeholder {
    color: var(--color-accent-6);
  }
</style>