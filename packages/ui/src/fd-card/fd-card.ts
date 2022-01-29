import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 * @cssprop {string} --fd-button-background-color - Adjusts the background-color
 */
@customElement('fd-card')
export class Card extends LitElement {
  static styles = css`
    div {
      --fd-card-background-color-default: var(--light-color-base);
      --fd-card-color-default: var(--primary-color-base);
      --fd-card-border-color-default: var(--neutral-color-base);
      --fd-card-shadow-default: var(--shadow-3);
      
      --fd-card-padding-inline-default: var(--size-8);
      --fd-card-padding-block-default: var(--size-7);
      
      display: inline-block;
      padding-inline: var(--fd-card-padding-inline, var(--fd-card-padding-inline-default));
      padding-block: var(--fd-card-padding-block, var(--fd-card-padding-block-default));
      color: var(--fd-card-color, var(--fd-card-color-default));

      appearance: none;
      border: 1px solid var(--fd-card-border-color, var(--fd-card-border-color-default));

      background-color: var(--fd-card-background-color, var(--fd-card-background-color-default));
      border-radius: var(--radius-conditional-3);
      box-shadow: var(--fd-card-shadow, var(--fd-card-shadow-default));
      
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
