import { css } from "lit";

export const labelStyles = css`
  :host {
    --fd-label-color-default: var(--primary-color-5);
    --fd-label-text-transform-default: uppercase;
    --fd-label-font-weight-default: var(--font-weight-6);
    --fd-label-font-size-default: var(--font-size-1);
  }

  .label {
    font-weight: var(--fd-label-font-weight, var(--fd-label-font-weight-default));
    font-size: var(--fd-label-font-size, var(--fd-label-font-size-default));
    text-transform: var(--fd-label-text-transform, var(--fd-label-text-transform-default));
    color: var(--fd-label-color, var(--fd-label-color-default));
  }
`;