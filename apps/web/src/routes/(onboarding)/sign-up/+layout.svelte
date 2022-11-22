<script lang="ts">
	import { onMount } from 'svelte';
	onMount(async () => {
    await import('ui');
  });
</script>

<header>
	<a href="/">
		<fd-logo />
	</a>
</header>
<slot></slot>

<style lang="postcss">
  header {
    display: grid;
		place-items: center;
		padding-block: var(--size-2);

    @media (--tablet) {
      padding-block: var(--size-3);
    }
  }
</style>