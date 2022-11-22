<script lang="ts">
	import Toast from "$lib/toast/Toast.svelte";
	import { notifications } from '$lib/toast/notifications';
	import { flip } from 'svelte/animate';
</script>

<div
		class="container"
		role="region"
		aria-live="polite"
	>
	{#each $notifications as notification (notification.id)}
		<div class="item" animate:flip>
			<Toast
				type={notification.type}
				message={notification.message}
			></Toast>
		</div>
	{/each}
</div>

<style lang="postcss">
  .container {
		position: fixed;
		padding: var(--size-3);
    z-index: var(--layer-5);
    pointer-events: none;
    display: flex;
		flex-direction: column;
		align-items: center;
    gap: var(--size-3);
    margin: 0px auto;
    bottom: env(safe-area-inset-bottom, 0px);
    right: env(safe-area-inset-right, 0px);
    left: env(safe-area-inset-left, 0px);	
	}

	.item {
		display: contents;
	}
</style>