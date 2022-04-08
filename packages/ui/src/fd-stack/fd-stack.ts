import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Vertical Stack using gaps in between
 *
 * @cssprop {string} --fd-stack-margin-inline-start - Adjusts margin inline start
 * @cssprop {string} --fd-stack-padding-inline - Adjusts padding inline
 */
@customElement('fd-stack')
export class Stack extends LitElement {
  static styles = css`
    :host {
      --fd-stack-gap: var(--size-3);
      --fd-stack-justify-items: stretch;
    }

    div {
      display: grid;
      gap: var(--fd-stack-gap);
      justify-items: var(--fd-stack-justify-items);
    }
  `

  render() {
    return html`
      <div>
        <slot />
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-stack': Stack
  }
}
