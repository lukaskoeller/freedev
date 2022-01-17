import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 * @cssprop {string} --fd-button-background-color - Adjusts the background-color
 */
@customElement('fd-button')
export class Button extends LitElement {
  static styles = css`
    button {
      display: inline-block;
      min-block-size: var(--size-8);
      padding-inline: var(--size-6);

      font-weight: var(--font-weight-6);
      font-size: var(--font-size-05);
      color: var(--light-color-base);

      appearance: none;
      border: none;

      background-color: var(--fd-button-background-color, var(--primary-color-base));
      border-radius: var(--radius-round);
    }
  `

  render() {
    return html`
      <button part="button">
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-button': Button
  }
}
