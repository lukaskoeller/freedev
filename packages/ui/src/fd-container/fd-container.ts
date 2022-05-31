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

    :host([data-content]) {
      --fd-container-inline-size: calc(4 * var(--size-content-1));
      --fd-container-padding-inline: 0;

      --fd-container-margin-inline: auto;
      margin-inline: var(--fd-container-margin-inline);
    }

    section {
      box-sizing: border-box;
      inline-size: min(var(--fd-container-inline-size, fit-content), 100%);
      margin-inline: var(--fd-container-margin-inline);
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
