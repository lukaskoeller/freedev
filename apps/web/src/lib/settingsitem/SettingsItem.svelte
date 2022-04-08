  <div class="item">
      <div class="icon">
          <slot name="icon" />
      </div>
      <div class="input">
          <fd-hr />
          <slot name="input" />
      </div>
  </div>
  
  <style lang="postcss">
    .item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--size-4);
    }

    .icon {
      padding-block-start: var(--size-3);
    }

    .input {
      display: grid;
      gap: var(--size-3);
    }
  </style>