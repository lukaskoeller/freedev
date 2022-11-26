<script lang="ts">
	import CheckboxButton from "$lib/checkboxbutton/CheckboxButton.svelte";
  import Fieldset from "$lib/fieldset/Fieldset.svelte";
  import { onMount } from "svelte";
	import FormContainer from "../FormContainer.svelte";
  import svgGo from 'assets/icons/go.svg?raw';
  import svgJavascript from 'assets/icons/javascript.svg?raw';
  import svgTypescript from 'assets/icons/typescript.svg?raw';
  import svgHtml5 from 'assets/icons/html5.svg?raw';
  import svgCss3 from 'assets/icons/css3.svg?raw';
  import svgPython from 'assets/icons/python.svg?raw';
  import svgCplusplus from 'assets/icons/cplusplus.svg?raw';
  import svgPhp from 'assets/icons/php.svg?raw';
  import svgRust from 'assets/icons/rust.svg?raw';
  import svgKotlin from 'assets/icons/kotlin.svg?raw';
  import svgSwift from 'assets/icons/swift.svg?raw';
  import svgDart from 'assets/icons/dart.svg?raw';
  import svgRuby from 'assets/icons/ruby.svg?raw';
  import svgAssembly from 'assets/icons/assemblyscript.svg?raw';

  onMount(async () => {
    await import('ui');
  });

  const heading: string = 'What do you rock at?';

  const LANGUAGES = [
    {
      id: 'javascript',
      name: 'javascript',
      file: svgJavascript,
      label: 'Javascript',
    },
    {
      id: 'html5',
      name: 'html5',
      file: svgHtml5,
      label: 'HTML5',
    },
    {
      id: 'css3',
      name: 'css3',
      file: svgCss3,
      label: 'CSS3',
    },
    {
      id: 'sql',
      name: 'sql',
      label: 'SQL',
    },
    {
      id: 'python',
      name: 'python',
      file: svgPython,
      label: 'Python',
    },
    {
      id: 'typescript',
      name: 'typescript',
      file: svgTypescript,
      label: 'Typescript',
    },
    {
      id: 'java',
      name: 'java',
      label: 'Java',
    },
    {
      id: 'c#',
      name: 'c#',
      label: 'C#',
    },
    {
      id: 'c++',
      name: 'c++',
      file: svgCplusplus,
      label: 'C++',
    },
    {
      id: 'php',
      name: 'php',
      file: svgPhp,
      label: 'PHP',
    },
    {
      id: 'c',
      name: 'c',
      label: 'C',
    },
    {
      id: 'go',
      name: 'go',
      file: svgGo,
      label: 'Go',
    },
    {
      id: 'rust',
      name: 'rust',
      file: svgRust,
      label: 'Rust',
    },
    {
      id: 'kotlin',
      name: 'kotlin',
      file: svgKotlin,
      label: 'Kotlin',
    },
    {
      id: 'dart',
      name: 'dart',
      file: svgDart,
      label: 'Dart',
    },
    {
      id: 'ruby',
      name: 'ruby',
      file: svgRuby,
      label: 'Ruby',
    },
    {
      id: 'assembly',
      name: 'assembly',
      file: svgAssembly,
      label: 'Assembly',
    },
    {
      id: 'swift',
      name: 'swift',
      file: svgSwift,
      label: 'Swift',
    },
  ];
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
      <Fieldset legend="Languages">
        <div class="fd-input-group">
          {#each LANGUAGES as { id, name, file, label }}
            <CheckboxButton {id}>
              <input type="checkbox" {name}>
              <svelte:fragment slot="label">
                {#if file}
                  <fd-icon {file} size="inline"></fd-icon>
                {/if}
                {label}
              </svelte:fragment>
            </CheckboxButton>
          {/each}
        </div>
      </Fieldset>
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