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
  import svgAmazonaws from 'assets/icons/amazonaws.svg?raw';
  import svgAstro from 'assets/icons/astro.svg?raw';
  import svgBun from 'assets/icons/bun.svg?raw';
  import svgContentful from 'assets/icons/contentful.svg?raw';
  import svgDeno from 'assets/icons/deno.svg?raw';
  import svgFlutter from 'assets/icons/flutter.svg?raw';
  import svgMongodb from 'assets/icons/mongodb.svg?raw';
  import svgMysql from 'assets/icons/mysql.svg?raw';
  import svgNodedotjs from 'assets/icons/nodedotjs.svg?raw';
  import svgPostgresql from 'assets/icons/postgresql.svg?raw';
  import svgReact from 'assets/icons/react.svg?raw';
  import svgReactrouter from 'assets/icons/reactrouter.svg?raw';
  import svgRedux from 'assets/icons/redux.svg?raw';
  import svgRemix from 'assets/icons/remix.svg?raw';
  import svgSolid from 'assets/icons/solid.svg?raw';
  import svgStoryblok from 'assets/icons/storyblok.svg?raw';
  import svgStorybook from 'assets/icons/storybook.svg?raw';
  import svgStrapi from 'assets/icons/strapi.svg?raw';
  import svgStripe from 'assets/icons/stripe.svg?raw';
  import svgTailwindcss from 'assets/icons/tailwindcss.svg?raw';
  import svgVuedotjs from 'assets/icons/vuedotjs.svg?raw';
  import svgFigma from 'assets/icons/figma.svg?raw';
  import svgGoogletagmanager from 'assets/icons/googletagmanager.svg?raw';
  import svgGoogleAnalytics from 'assets/icons/googleanalytics.svg?raw';
  import svgJiraSoftware from 'assets/icons/jirasoftware.svg?raw';
	import Modal from "$lib/modal/Modal.svelte";
	import { applyAction, enhance } from "$app/forms";
	import type { FieldErrors } from "validations";
	import { invalidateAll } from "$app/navigation";
	import { notifications } from "$lib/toast/notifications";
	import { validate } from "./_validations";
	import InputGroup from "$lib/inputgroup/InputGroup.svelte";

  onMount(async () => {
    await import('ui');
  });

  let languages: string[] = [];
  let technologies: string[] = [];
  let tools: string[] = [];
  let searchQuery: string;

  let formErrors: undefined | FieldErrors;
  let isSubmitting: boolean = false;

  const heading: string = 'What do you rock at?';

  const MAX_ITEMS_SHOWN = 9;

  type Language = {
    id: string;
    name: string;
    file?: string;
    label: string;
  }

  const LANGUAGES: Language[] = [
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

  enum TechCategory {
    CloudService = 'Cloud Computing Service',
    Framwork = 'Framework',
    JSRuntime = 'JavaScript Runtime',
    CMS = 'Content Management',
    SDK = 'Software Development Kit (SDK)',
    Database = 'Database',
    Library = 'Library',
    Utilities = 'Utilities',
    Payment = 'Payment',
    DevOps = 'Development Operations',
    BusinessTools = 'Business Tools',
  }

  type Technology = {
    id: string;
    name: string;
    file: string;
    label: string;
    category: TechCategory;
    language: string[];
    popularity: number;
  }

  const TECHNOLOGIES: Technology[] = [
    {
      id: 'aws',
      name: 'aws',
      file: svgAmazonaws,
      label: 'AWS',
      category: TechCategory.CloudService,
      language: ['python', 'javascript', 'typescript', 'go', 'java'],
      popularity: 7222,
    },
    {
      id: 'astro',
      name: 'astro',
      file: svgAstro,
      label: 'Astro',
      category: TechCategory.Framwork,
      language: ['javascript', 'typescript'],
      popularity: 23217,
    },
    {
      id: 'bun',
      name: 'bun',
      file: svgBun,
      label: 'Bun',
      category: TechCategory.JSRuntime,
      language: ['javascript', 'typescript'],
      popularity: 36572,
    },
    {
      id: 'contentful',
      name: 'contentful',
      file: svgContentful,
      label: 'Contentful',
      category: TechCategory.CMS,
      language: ['javascript', 'typescript', 'php', 'go', 'java'], // @todo add more
      popularity: 973,
    },
    {
      id: 'deno',
      name: 'deno',
      file: svgDeno,
      label: 'Deno',
      category: TechCategory.JSRuntime,
      language: ['javascript', 'typescript'],
      popularity: 86752,
    },
    {
      id: 'flutter',
      name: 'flutter',
      file: svgFlutter,
      label: 'Flutter',
      category: TechCategory.SDK,
      language: ['dart'],
      popularity: 147191,
    },
    {
      id: 'mongodb',
      name: 'mongodb',
      file: svgMongodb,
      label: 'MongoDB',
      category: TechCategory.Database,
      language: ['javascript', 'typescript'],
      popularity: 22912,
    },
    {
      id: 'mysql',
      name: 'mysql',
      file: svgMysql,
      label: 'MySQL',
      category: TechCategory.Database,
      language: ['sql'],
      popularity: 17562,
    },
    {
      id: 'nodejs',
      name: 'nodejs',
      file: svgNodedotjs,
      label: 'Node.js',
      category: TechCategory.JSRuntime,
      language: ['javascript', 'typescript'],
      popularity: 91980,
    },
    {
      id: 'postgresql',
      name: 'postgresql',
      file: svgPostgresql,
      label: 'PostgreSQL',
      category: TechCategory.Database,
      language: ['sql'],
      popularity: 11436,
    },
    {
      id: 'react',
      name: 'react',
      file: svgReact,
      label: 'React',
      category: TechCategory.Framwork,
      language: ['javascript', 'typescript'],
      popularity: 198820,
    },
    {
      id: 'reactrouter',
      name: 'reactrouter',
      file: svgReactrouter,
      label: 'React Router',
      category: TechCategory.Library,
      language: ['javascript', 'typescript', 'react-native'],
      popularity: 48978,
    },
    {
      id: 'redux',
      name: 'redux',
      file: svgRedux,
      label: 'Redux',
      category: TechCategory.Library,
      language: ['javascript', 'typescript'],
      popularity: 58965,
    },
    {
      id: 'remix',
      name: 'remix',
      file: svgRemix,
      label: 'Remix',
      category: TechCategory.Framwork,
      language: ['javascript', 'typescript'],
      popularity: 21102,
    },
    {
      id: 'solid',
      name: 'solid',
      file: svgSolid,
      label: 'Solid',
      category: TechCategory.Framwork,
      language: ['javascript', 'typescript'],
      popularity: 23965,
    },
    {
      id: 'storyblok',
      name: 'storyblok',
      file: svgStoryblok,
      label: 'Storyblok',
      category: TechCategory.CMS,
      language: ['javascript', 'typescript'],
      popularity: 296,
    },
    {
      id: 'storybook',
      name: 'storybook',
      file: svgStorybook,
      label: 'Storybook',
      category: TechCategory.Library,
      language: ['javascript', 'typescript'],
      popularity: 75418,
    },
    {
      id: 'strapi',
      name: 'strapi',
      file: svgStrapi,
      label: 'Strapi',
      category: TechCategory.CMS,
      language: ['javascript', 'typescript'],
      popularity: 50437,
    },
    {
      id: 'stripe',
      name: 'stripe',
      file: svgStripe,
      label: 'Stripe',
      category: TechCategory.Payment,
      language: ['javascript', 'typescript'],
      popularity: 3172,
    },
    {
      id: 'tailwindcss',
      name: 'tailwindcss',
      file: svgTailwindcss,
      label: 'tailwindcss',
      category: TechCategory.Utilities,
      language: ['HTML5'],
      popularity: 62949,
    },
    {
      id: 'vue',
      name: 'vue',
      file: svgVuedotjs,
      label: 'Vue',
      category: TechCategory.Framwork,
      language: ['javascript', 'typescript'],
      popularity: 201135,
    },
  ];

  type Tool = {
    id: string;
    name: string;
    file?: string;
    label: string;
  }

  const TOOLS: Tool[] = [
    {
      id: 'figma',
      name: 'figma',
      file: svgFigma,
      label: 'Figma',
    },
    {
      id: 'googleanalytics',
      name: 'googleanalytics',
      file: svgGoogleAnalytics,
      label: 'Google Analytics',
    },
    {
      id: 'googletagmanager',
      name: 'googletagmanager',
      file: svgGoogletagmanager,
      label: 'Google Tag Manager',
    },
    {
      id: 'jirasoftware',
      name: 'jirasoftware',
      file: svgJiraSoftware,
      label: 'Jira',
    },
  ];

  $: sortBySelectedLanguages = (technologyA: Technology, technologyB: Technology): number => {
    const technologyHasLanguage = (technology: Technology) => {
      const mergedArr = [...technology.language, ...languages];
      
      return mergedArr.length !== new Set(mergedArr).size; 
    };

    if (technologyHasLanguage(technologyA) === technologyHasLanguage(technologyB)) return 0;
    if (
      technologyHasLanguage(technologyA) === true && technologyHasLanguage(technologyB) === false
    ) return - 1; // sort a before b  
    else return 1;
  };

  const sortByPopularity = (technologyA: Technology, technologyB: Technology): number => (
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
                  <fd-icon {file} size="inline"></fd-icon>
                {/if}
                {label}
              </svelte:fragment>
            </CheckboxButton>
          {/each}
        </InputGroup>
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
                    <fd-icon {file} size="inline"></fd-icon>
                  {/if}
                  {label}
                </svelte:fragment>
              </CheckboxButton>
            {/each}
          </InputGroup>
          <fd-button
            type="button"
            variant="light"
            style="justify-self: end;"
            on:click={() => window.Skills.showModal()}
            on:keypress={() => window.Skills.showModal()}
          >
            Find more
          </fd-button>
          <Modal id="Skills">
            <h2 slot="heading">Your Stack</h2>
            <div class="fd-stack">
              <fd-input
                name="technology"
                placeholder="Search all..."
                list="technology-list"
                type="search"
                label="Search"
                required
                on:fd-input={handleSearchInput}
              >
                {#each TECHNOLOGIES as { name } ({ name })}
                  <option value={name}>
                {/each}
              </fd-input>
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
                        <fd-icon {file} size="inline"></fd-icon>
                      {/if}
                      {label}
                    </svelte:fragment>
                  </CheckboxButton>
                {/each}
              </div>
            </div>
            <menu slot="footer">
              <fd-button type="submit">Add</fd-button>
            </menu>
          </Modal>
        </div>
      </Fieldset>
      <Fieldset variant="light" legend="Tools & More">
        <div class="fd-input-group">
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
                  <fd-icon {file} size="inline"></fd-icon>
                {/if}
                {label}
              </svelte:fragment>
            </CheckboxButton>
          {/each}
        </div>
      </Fieldset>
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