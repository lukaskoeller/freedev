<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	// import Counter from '$lib/Counter.svelte';
	import { onMount } from 'svelte';
  onMount(async () => {
    await import('ui');
  });
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<fd-button>Hallodri Kalodri</fd-button>
	<fd-gallery>
		<div class="kpi">
			<fd-label tag="div">Hourly Rate</fd-label>
			<span>123 €</span>
		</div>
	</fd-gallery>
</section>

<style lang="postcss">
	.kpi {
		text-align: center;
	}
</style>
