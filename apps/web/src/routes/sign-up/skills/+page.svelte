<script lang="ts">
	import CheckboxButton from "$lib/checkboxbutton/CheckboxButton.svelte";
  import Fieldset from "$lib/fieldset/Fieldset.svelte";
	import FormContainer from "../FormContainer.svelte";
	import Modal from "$lib/modal/Modal.svelte";
	import { applyAction, enhance } from "$app/forms";
	import type { FieldErrors } from "validations";
	import { invalidateAll } from "$app/navigation";
	import { notifications } from "$lib/toast/notifications";
	import { validate } from "./_validations";
	import InputGroup from "$lib/inputgroup/InputGroup.svelte";
	import Icon from "$lib/icon/Icon.svelte";
	import InputWrapper from "$lib/inputwrapper/InputWrapper.svelte";
	import { LANGUAGES, TECHNOLOGIES, TOOLS, type TTechnology } from "$lib/constants/skills";

  let languages: string[] = [];
  let technologies: string[] = [];
  let tools: string[] = [];
  let searchQuery: string;

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;

  const heading: string = 'What do you rock at?';

  const MAX_ITEMS_SHOWN = 9;

  $: sortBySelectedLanguages = (technologyA: TTechnology, technologyB: TTechnology): number => {
    const technologyHasLanguage = (technology: TTechnology) => {
      const mergedArr = [...technology.language, ...languages];
      
      return mergedArr.length !== new Set(mergedArr).size; 
    };

    if (technologyHasLanguage(technologyA) === technologyHasLanguage(technologyB)) return 0;
    if (
      technologyHasLanguage(technologyA) === true && technologyHasLanguage(technologyB) === false
    ) return - 1; // sort a before b  
    else return 1;
  };

  const sortByPopularity = (technologyA: TTechnology, technologyB: TTechnology): number => (
    technologyB.popularity - technologyA.popularity
  );

  $: allTechnologies = TECHNOLOGIES
    .sort((technologyA, technologyB) => sortByPopularity(technologyA, technologyB))
    .sort((technologyA, technologyB) => sortBySelectedLanguages(technologyA, technologyB))

  $: baseTechnologies = allTechnologies.slice(0, MAX_ITEMS_SHOWN);

  $: filteredTechnologies = searchQuery ? allTechnologies.filter((technology) => {
    return technology.label.toLowerCase().includes(searchQuery.toLowerCase())
  }) : allTechnologies;

  $: selectedTechnologies = TECHNOLOGIES.filter((technology) => technologies.includes(technology.name));
  $: technologysInQuikView = [...new Map(
    [...baseTechnologies, ...selectedTechnologies]
      .map((technology) => [technology.name, technology])
  ).values()];

  const handleSearchInput = (e: InputEvent) => {
    const query = (e.target as HTMLInputElement).value;
    searchQuery = query;
  }
</script>

<svelte:head>
	<title>Sign Up / {heading}</title>
</svelte:head>

<FormContainer heading={heading}>
  <form
    id="sign-up-skills"
    method="POST"
    use:enhance={(props) => {
      isSubmitting = true;
      const { form, data, cancel } = props;
      form.dispatchEvent(new CustomEvent('submitting'));

      const formData = {
        languages,
        technologies,
        tools,
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
      <Fieldset variant="light" legend="Languages">
        <InputGroup text={formErrors?.get('languages')}>
          {#each LANGUAGES as { id, name, file, label } ({ id })}
            <CheckboxButton {id}>
              <input
                type="checkbox"
                {name}
                value={name}
                bind:group={languages}
              >
              <svelte:fragment slot="label">
                {#if file}
                  <Icon size="inline">
                    {@html file}                    
                  </Icon>
                {/if}
                {label}
              </svelte:fragment>
            </CheckboxButton>
          {/each}
        </InputGroup>
        <select
          class="visually-hidden"
          inert
          aria-hidden
          name="languages"
          bind:value={languages}
          multiple
        >
          {#each LANGUAGES as { id, name } ({ id })}
            <option>{name}</option>
          {/each}
        </select>
      </Fieldset>
      <Fieldset variant="light" legend="Application & Data">
        <div class="fd-stack">
          <InputGroup text={formErrors?.get('technologies')}>
            {#each technologysInQuikView as { id, name, file, label } ({ id })}
              <CheckboxButton {id}>
                <input
                  type="checkbox"
                  {name}
                  value={name}
                  bind:group={technologies}
                >
                <svelte:fragment slot="label">
                  {#if file}
                    <Icon size="inline">
                      {@html file}
                    </Icon>
                  {/if}
                  {label}
                </svelte:fragment>
              </CheckboxButton>
            {/each}
          </InputGroup>
          <select
            class="visually-hidden"
            inert
            aria-hidden
            name="technologies"
            bind:value={technologies}
            multiple
          >
            {#each TECHNOLOGIES as { id, name } ({ id })}
              <option>{name}</option>
            {/each}
          </select>
          <button
            class="fd-button"
            type="button"
            data-variant="light"
            style="justify-self: end;"
            on:click={() => window.Skills.showModal()}
            on:keypress={() => window.Skills.showModal()}
          >
            Find more
          </button>
          <Modal id="Skills">
            <h2 slot="heading">Your Stack</h2>
            <div class="fd-stack">
              <InputWrapper id="technology">
                <svelte:fragment slot="label">Search</svelte:fragment>
                <input
                  class="fd-input"
                  name="technology"
                  placeholder="Search all..."
                  list="technology-list"
                  type="search"
                  on:input={handleSearchInput}
                />
              </InputWrapper>
              <datalist id="technology-list">
                {#each TECHNOLOGIES as { name } ({ name })}
                  <option value={name}>
                {/each}
              </datalist>
              <div class="fd-input-group">
                {#each filteredTechnologies as { id, name, file, label } ({ name })}
                  <CheckboxButton {id}>
                    <input
                      type="checkbox"
                      {name}
                      value={name}
                      bind:group={technologies}
                    >
                    <svelte:fragment slot="label">
                      {#if file}
                        <Icon size="inline">
                          {@html file}
                        </Icon>
                      {/if}
                      {label}
                    </svelte:fragment>
                  </CheckboxButton>
                {/each}
              </div>
            </div>
            <menu slot="footer">
              <button class="fd-button" type="submit">Add</button>
            </menu>
          </Modal>
        </div>
      </Fieldset>
      <Fieldset variant="light" legend="Tools & More">
        <InputGroup text={formErrors?.get('tools')}>
          {#each TOOLS as { id, name, file, label } ({ id })}
            <CheckboxButton {id}>
              <input
                type="checkbox"
                {name}
                value={name}
                bind:group={tools}
              >
              <svelte:fragment slot="label">
                {#if file}
                  <Icon size="inline">
                    {@html file}
                  </Icon>
                {/if}
                {label}
              </svelte:fragment>
            </CheckboxButton>
          {/each}
        </InputGroup>
        <select
          class="visually-hidden"
          inert
          aria-hidden
          name="tools"
          bind:value={tools}
          multiple
        >
          {#each TOOLS as { id, name } ({ id })}
            <option>{name}</option>
          {/each}
        </select>
      </Fieldset>
    </div> 
  </form>
  <button
    class="fd-button"
    slot="footer"
    form="sign-up-skills"
    data-expand
  >
    Go to profile
  </button>
</FormContainer>