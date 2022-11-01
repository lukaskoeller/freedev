<div class="bar">
  <form>
    <div class="search">
      <input type="search" placeholder="z.B. React Frontend Engineer" name="search" id="search">
      <button type="submit">Search</button>
    </div>
  </form>
</div>

<style lang="postcss">
  .bar {
    max-inline-size: 100%;
    padding: var(--size-fluid-2);
    border-radius: var(--radius-round);
    border: var(--border-size-1) solid var(--color-border);
    background-color: var(--color-surface-1);
    box-shadow: var(--shadow-3);
  }

  form {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  .search {
    inline-size: 100%;
    min-inline-size: 0;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    gap: var(--size-fluid-1);
  }

  input {
    min-inline-size: 0;
    block-size: min(var(--size-fluid-5), 100%);
    padding-inline-start: var(--size-fluid-3);
    border-radius: var(--radius-round);
    background: transparent;
    font-size: var(--font-size-fluid-1);
  }

  button {
    min-inline-size: 0;
    /* aspect-ratio: 1; */
    block-size: 100%;
    padding-inline: var(--size-4);
    padding-block: var(--size-2);
    border-radius: var(--radius-round);
    background-color: var(--color-primary-base);
    color: var(--color-on-primary);
  }
</style>