import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * A classic Card component.
 *
 * @slot This element has a slot
 * @csspart card - Styles the Card's div
 * @cssprop --fd-card-background-color - Adjusts the background color
 * @cssprop --fd-card-color - Adjusts the font color
 * @cssprop --fd-card-shadow - Sets the Card's shadow
 * @cssprop --fd-card-padding-inline - Sets the inline padding
 * @cssprop --fd-card-padding-block - Sets the block padding
 */
@customElement('fd-card')
export class Card extends LitElement {
  static styles = css`
    :host {
      --fd-card-background-color: var(--color-surface-1);
      --fd-card-color: var(--text-1);
      --fd-card-border-color: var(--color-border);
      --fd-card-shadow: var(--shadow-3);

      /* private proxy to avoid higher specificity of @media selector */
      --fd-card-padding-inline: var(--size-3);
      --fd-card-padding-block: var(--size-7);
    }

    div {
      inline-size: 100%;
      display: inline-block;
      box-sizing: border-box;
      padding-inline: var(--fd-card-padding-inline);
      padding-block: var(--fd-card-padding-block);
      color: var(--fd-card-color);

      appearance: none;
      border: 1px solid var(--fd-card-border-color);

      background-color: var(--fd-card-background-color);
      border-radius: var(--radius-conditional-3);
      box-shadow: var(--fd-card-shadow);
    }

    @media (min-width: 1024px) {
      :host {
        --fd-card-padding-inline: var(--size-9);
      }
    }
  `

  @property()
  variant: "default" = "default";

  render() {
    return html`
      <div part="card" data-variant="${this.variant}">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-card': Card
  }
}
