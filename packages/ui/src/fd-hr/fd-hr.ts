import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Horizontal rule (divider)
 *
 * @cssprop {string} --fd-hr-margin-inline-start - Adjusts margin inline start
 * @cssprop {string} --fd-hr-padding-inline - Adjusts padding inline
 */
@customElement('fd-hr')
export class Hr extends LitElement {
  static styles = css`
    :host {
      --fd-hr-margin-inline-start: 0;
      --fd-hr-padding-inline: 0;
    }

    hr {
      display: block;
      inline-size: calc(100% - var(--fd-hr-padding-inline));
      margin: 0;
      border-left: 0;
      border-top: 1px solid var(--primary-color-1);
      margin-inline-start: var(--fd-hr-margin-inline-start);
    }
  `

  render() {
    return html`
      <hr part="hr" />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-hr': Hr
  }
}
