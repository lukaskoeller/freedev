<script lang="ts">
	import { ALL_SKILLS } from "$lib/constants/skills";
	import Icon from "$lib/icon/Icon.svelte";

  export let items;
  export let heading;

  console.log(ALL_SKILLS);
</script>

<div class="fd-card card">
  <div class="fd-stack">
    <div class="header">
      <h3>{heading}</h3>
      {#if items.length > 12}
        <button class="fd-button" data-size="sm" type="button">
          View all
        </button>
      {/if}
    </div>
    <div class="body">
      {#each items as item}
        <div class="fd-radio-button">
          {#if ALL_SKILLS[item.skill]?.file}
            <Icon size="inline">
                {@html ALL_SKILLS[item.skill].file}               
            </Icon>
          {/if}
          {ALL_SKILLS[item.skill]?.label}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .card {
    --card-gap: var(--_fd-card-padding-inline);
    
    @media (--tablet) {
      --card-gap: calc(
        var(--_fd-card-padding-inline) / 1.5 
      );
    }

    --fd-stack-gap: var(--card-gap);

    padding-block-start: var(--card-gap);
    /* inline-size: min(var(--size-15), 100%); */
  }
  .header {
    display: flex;
    justify-content: space-between;
  }

  h3 {
    font-size: var(--font-size-4);
  }

  .body {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2);
  }
</style>