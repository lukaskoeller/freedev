<fd-card class="card" style="--fd-card-padding-inline: var(--size-3);">
  <div class="fd-stack">
    <div class="header">
      <div class="avatar"></div>
      <div class="info">
        <div>
          <h4 class="title">Lukas Köller</h4>
          <div class="profession">React Frontend Developer</div>
        </div>
        <fd-button>View</fd-button>
      </div>
    </div>
    <div class="key-info">
      <div>
        <fd-label as="div">Hourly Rate</fd-label>
        <span>123 €</span>
      </div>
      <div>
        <fd-label as="div">Available From</fd-label>
        <span>Feb 12</span>
      </div>
      <div>
        <fd-label as="div">Capacity</fd-label>
				  <span>30h/week</span>
      </div>
    </div>
  </div>
</fd-card>

<style lang="postcss">
  fd-card::part(card) {
    inline-size: min(calc(var(--size-9) * 6), calc(100vw - 2 * var(--size-3)));
  }

  .fd-stack {
    --fd-stack-gap: var(--size-7);
  }

  .header {
    display: flex;
    gap: var(--size-7);
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

  .profession {
    color: var(--text-2);
  }

  fd-button {
    justify-self: end;
  }

  .key-info {
    display: flex;
    justify-content: space-around;
    gap: var(--size-3);
    inline-size: 100%;
    min-width: 0;
  }

  fd-label {
    --fd-label-font-size: var(--font-size-0);
    --fd-label-color: var(--text-2);
  }
</style>