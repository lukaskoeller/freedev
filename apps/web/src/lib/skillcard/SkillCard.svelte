<script>

	import Icon from "$lib/icon/Icon.svelte";
	import { Size } from "types";

  export let name;
  export let category;
  export let icon;

</script>

<div class="fd-card card" data-size="sm">
  <Icon size={Size.Xl}>
    {@html icon}
  </Icon>
  <div class="caption">
    <span class="name">{name}</span>
    <span class="fd-info-text">{category}</span>
  </div>
</div>

<style lang="postcss">
	.card {
		/* display: grid;
		justify-items: center;
		align-items: center; */
    display: flex;
    align-items: center;
		inline-size: auto;
		gap: var(--size-3);
		/* --fd-card-background-color: var(--color-surface-2); */
		font-weight: var(--font-weight-6);
		font-size: var(--font-size-2);

    & > svg {
      flex: 1 1 auto;
    }
	}

	.caption {
		display: grid;
		/* text-align: center; */
	}

  .name {
    display: block;
    inline-size: 100%;
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
  }

</style>