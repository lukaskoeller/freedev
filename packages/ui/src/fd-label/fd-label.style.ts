import { css } from "lit";

export const labelStyles = css`
  :host {
    --fd-label-color: var(--primary-color-5);
    --fd-label-text-transform: uppercase;
    --fd-label-font-weight: var(--font-weight-6);
    --fd-label-font-size: var(--font-size-1);
  }

  .label {
    font-weight: var(--fd-label-font-weight);
    font-size: var(--fd-label-font-size);
    text-transform: var(--fd-label-text-transform);
    color: var(--fd-label-color);
  }
`;