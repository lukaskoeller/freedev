<div class="fd-card">
  <div class="fd-stack">
    <div class="header">
      <div class="avatar"></div>
      <div class="info">
        <div>
          <div class="title">Lukas Köller</div>
          <div class="profession">React Frontend Developer</div>
        </div>
        <button class="fd-button">View</button>
      </div>
    </div>
    <div class="key-info">
      <div>
        <div class="fd-label">Hourly Rate</div>
        <span>123 €</span>
      </div>
      <div>
        <div class="fd-label">Available From</div>
        <span>Feb 12</span>
      </div>
      <div>
        <div class="fd-label">Capacity</div>
				  <span>30h/week</span>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .fd-card {
    --fd-card-padding-inline: var(--size-3);

    inline-size: min(calc(var(--size-9) * 6), calc(100vw - 2 * var(--size-3)));
  }

  .title {
    font-weight: var(--font-weight-5);
    font-size: var(--font-size-4);
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

  .fd-button {
    justify-self: end;
  }

  .key-info {
    display: flex;
    justify-content: space-around;
    gap: var(--size-3);
    inline-size: 100%;
    min-width: 0;
  }

  .fd-label {
    --fd-label-font-size: var(--font-size-0);
    --fd-label-color: var(--text-2);
  }
</style>