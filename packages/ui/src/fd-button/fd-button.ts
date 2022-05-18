import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
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
      --fd-button-background-color-default: var(--color-link);
      --fd-button-background-color-default--hover: var(--color-link-hover);
      --fd-button-color-default: var(--color-on-primary);
      --fd-button-color-default--hover: var(--color-on-primary);
      
      --fd-button-padding-inline-default: var(--size-6);
      --fd-button-block-size-default: var(--size-8);
      --fd-button-font-size-default: var(--font-size-1);
      
      display: inline-block;
      min-block-size: var(--fd-button-block-size, var(--fd-button-block-size-default));
      padding-inline: var(--fd-button-padding-inline, var(--fd-button-padding-inline-default));

      font-weight: var(--font-weight-6);
      font-size: var(--fd-button-font-size, var(--fd-button-font-size-default));
      color: var(--fd-button-color, var(--fd-button-color-default));

      appearance: none;
      border: none;

      background-color: var(--fd-button-background-color, var(--fd-button-background-color-default));
      border-radius: var(--radius-round);
      
      cursor: pointer;
    }
    
    button:hover {
      background-color: var(--fg-button-background-color--hover, var(--fd-button-background-color-default--hover));
      color: var(--fd-button-color--hover, var(--fd-button-color-default--hover));
    }
    
    button[data-variant="light"] {
      --fd-button-background-color-default: var(--light-color-base);
      --fd-button-background-color-default--hover: var(--light-color-base);
      --fd-button-color-default: var(--primary-color-base);
      --fd-button-color-default--hover: var(--primary-color-5);
    }
    
    button[data-variant="stealth"] {
      --fd-button-background-color-default: transparent;
      --fd-button-background-color-default--hover: transparent;
      --fd-button-color-default: var(--primary-color-5);
      --fd-button-color-default--hover: var(--primary-color-4);
    }
    
    button[data-size="small"] {
      --fd-button-padding-inline-default: var(--size-3);
      --fd-button-block-size-default: var(--size-7);
      --fd-button-font-size-default: var(--font-size-0);
    }
  `

  @property()
  variant: "default" | "light" | "stealth" = "default";

  @property()
  size: "default" | "small" = "default";

  render() {
    return html`
      <button part="button" data-variant="${this.variant}" data-size="${this.size}">
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
