<script>
	import Stack from "$lib/stack/Stack.svelte";
</script>

<fd-card class="card" style="--fd-card-padding-inline: 0px;">
  <Stack --fd-stack-gap="var(--size-7)">
    <div class="header">
      <div class="avatar"></div>
      <div class="info">
        <div>
          <h4 class="title">Lukas Köller</h4>
          <div>React Frontend Developer</div>
        </div>
        <fd-button>View</fd-button>
      </div>
    </div>
    <div class="key-info">
      <fd-gallery style="--fd-gallery-gap: var(--size-3);">
        <fd-gallery-item>
          <fd-label as="div">Hourly Rate</fd-label>
				  <span>123 €</span>
        </fd-gallery-item>
        <fd-gallery-item>
          <fd-label as="div">Available From</fd-label>
          <span>Feb 12</span>
        </fd-gallery-item>
        <fd-gallery-item>
          <fd-label as="div">Projects</fd-label>
				  <span>42</span>
        </fd-gallery-item>
        <fd-gallery-item>
          <fd-label as="div">Happiness</fd-label>
				  <span>4.3 (27)</span>
        </fd-gallery-item>
        <fd-gallery-item>
          <fd-label as="div">Capacity</fd-label>
				  <span>30h/week</span>
        </fd-gallery-item>
      </fd-gallery>
    </div>
  </Stack>
</fd-card>

<style lang="postcss">
  fd-card::part(card) {
    inline-size: calc(var(--size-9) * 6);
  }

  .header {
    display: flex;
    gap: var(--size-7);
    padding-inline: var(--size-3);
  }

  .avatar {
    --size: var(--size-10);
    block-size: var(--size);
    inline-size: var(--size);
    border-radius: var(--radius-round);
    background-color: var(--color-surface-2);
  }

  .info {
    flex-grow: 1;
    display: grid;
		gap: var(--size-5);
		padding-block-start: var(--size-1);
  }

  fd-button {
    justify-self: end;
  }

  .key-info {
    inline-size: 100%;
    min-width: 0;
  }

  fd-label {
    --fd-label-font-size: var(--font-size-0);
    --fd-label-color: var(--text-2);
  }
</style>