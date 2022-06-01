import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';
import '../fd-label/fd-label';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Visually hidden is used when an element needs to be available to assistive technologies like screen readers, but be otherwise hidden.
 *
 * @slot - The visually hidden content.
 */
@customElement('fd-visually-hidden')
export class VisuallyHidden extends LitElement {
  static styles = css`
    :host {
      all: initial;
      inset-block-start: 0px;
      clip: rect(1px, 1px, 1px, 1px) !important;
      block-size: 1px !important;
      position: absolute !important;
      inline-size: 1px !important;
      border-width: 0px !important;
      border-style: initial !important;
      border-color: initial !important;
      border-image: initial !important;
      overflow: hidden !important;
      padding: 0px !important;
    }

    slot {
      display: contents;
    }
  `

  render() {
    return html`
      <slot />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-visually-hidden': VisuallyHidden
  }
}
