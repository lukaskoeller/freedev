import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';
import '../fd-label/fd-label';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * General wrapper providing basic inline and block padding
 *
 * @slot - Content of the container
 * @cssprop {string} --fd-container-padding-inline
 * @cssprop {string} --fd-container-padding-inline-start
 * @cssprop {string} --fd-container-padding-inline-end
 * @cssprop {string} --fd-container-padding-block
 */
@customElement('fd-container')
export class Container extends LitElement {
  static styles = css`
    :host {
      --fd-container-padding-inline: var(--global-spacing);
      --fd-container-padding-inline-start: var(--fd-container-padding-inline);
      --fd-container-padding-inline-end: var(--fd-container-padding-inline);
      --fd-container-padding-block: calc(var(--global-spacing) / 2);
    }

    section {
      padding-inline-start: var(--fd-container-padding-inline-start);
      padding-inline-end: var(--fd-container-padding-inline-end);
      padding-block: var(--fd-container-padding-block);
    }
  `

  render() {
    return html`
      <section part="container">
        <slot />
      </section>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-container': Container
  }
}
