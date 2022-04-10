  <div class="item">
      <fd-hr />
      <div class="icon">
          <slot name="icon" />
      </div>
      <div class="input">
        <slot name="input" />
      </div>
  </div>
  
  <style lang="postcss">
    .item {
      display: grid;
      grid:
        ". hr" auto
        "icon input" auto
        / auto 1fr;
      gap: min(var(--fd-card-padding-inline, var(--size-4)), var(--size-4));
      align-items: center;
    }

    fd-hr {
      grid-area: hr;
    }

    .icon {
      grid-area: icon;
    }

    .input {
      grid-area: input;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--size-3);
    }

    .item:first-child fd-hr {
      display: none;
    }
  </style>