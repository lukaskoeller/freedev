import { css, LitElement } from "lit";
import { html } from "lit/static-html.js";
import { customElement, property } from "lit/decorators.js";

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Progress Circle Component e.g. used for a "complete profile" card.
 *
 * @cssprop {string} --fd-progress-circle-fill-active - Adjusts the fill color of the circle
 * @cssprop {string} --fd-progress-circle-fill-inactive - Adjusts the fill color of the progress circle
 * @cssprop {string} --fd-progress-circle-inline-size - Size of the circle
 */
@customElement("fd-progress-circle")
export class ProgressCircle extends LitElement {
  static styles = css`
    :host {
      --fd-progress-circle-fill-active: var(--color-surface-2);
      --fd-progress-circle-fill-inactive: var(--color-surface-2);
      --fd-progress-circle-inline-size: 160px;
    }

    div {
      display: grid;
      grid-template: "center" 1fr /1fr;
      place-items: center;
      inline-size: var(--fd-progress-circle-inline-size);
      block-size: var(--fd-progress-circle-inline-size);
    }

    div[data-variant="default"] {
      --fd-progress-circle-fill-active: var(--color-primary-base);
      --fd-progress-circle-fill-inactive: var(--color-surface-2);
    }

    div[data-variant="inverted"] {
      --fd-progress-circle-fill-active: var(--color-accent-0);
      --fd-progress-circle-fill-inactive: var(--color-primary-8);
    }

    svg {
      inline-size: 100%;
      grid-area: center;
    }

    #label {
      --fd-label-color-default: var(--fd-progress-circle-fill-active);

      grid-area: center;
      inline-size: fit-content;
      block-size: fit-content;
      margin: 0;
    }

    circle {
      fill: transparent;
      stroke-width: 6px;
    }

    #inactive {
      stroke: var(--fd-progress-circle-fill-inactive);
    }

    #active {
      stroke: var(--fd-progress-circle-fill-active);
      stroke-linecap: round;
      stroke-miterlimit: 10;
      stroke-linejoin: round;
      transition: all 500ms ease-in-out;
    }
  `;

  @property({ reflect: true, type: Number })
  totalSteps: number = 10;

  @property({ reflect: true, type: Number })
  progress: number = 3;

  @property({ state: true })
  protected _radius: number = 60;

  @property()
  variant: "default" | "inverted" = "default";

  render() {
    return html`
      <div data-variant="${this.variant}">
        <svg
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle r="60" cx="64" cy="64" id="inactive" />
          <circle
            r="${this._radius}"
            cx="64"
            cy="64"
            id="active"
            stroke-dasharray="
              ${(2 * Math.PI * this._radius * this.progress) / this.totalSteps} 
              ${2 *
            Math.PI *
            this._radius *
            ((this.totalSteps - this.progress) / this.totalSteps)}"
            stroke-dashoffset="${0.25 * (2 * Math.PI * this._radius)}"
          />
        </svg>
        <fd-label id="label" as="span"
          >${this.progress} / ${this.totalSteps}</fd-label
        >
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "fd-progress-circle": ProgressCircle;
  }
}
