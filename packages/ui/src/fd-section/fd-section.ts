import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '../fd-label/fd-label';

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Generalized section component
 *
 * @slot - Content of the section
 * @cssprop {string} --fd-section-padding-inline
 * @cssprop {string} --fd-section-padding-inline-start
 * @cssprop {string} --fd-section-padding-inline-end
 */
@customElement('fd-section')
export class Section extends LitElement {
  static styles = css`
    :host {
      --fd-section-padding-inline: var(--global-spacing);
      --fd-section-padding-inline-start: var(--fd-section-padding-inline);
      --fd-section-padding-inline-end: var(--fd-section-padding-inline);
    }

    section {
      display: grid;
      gap: var(--size-3);
      grid-template-columns: minmax(0, 1fr);
      padding-block: var(--global-spacing);
    }

    section[data-full-width="true"] {
      --fd-section-padding-inline-start: 0;
      --fd-section-padding-inline-end: 0;
    }

    .header {
      box-sizing: border-box;
      inline-size: 100%;
      display: flex;
      justify-content: space-between;
      align-items: baseline;

      padding-inline: var(--fd-section-padding-inline);
    }

    h2 {
      margin-block: 0;
      font-size: var(--font-size-fluid-2);
      font-weight: var(--font-weight-5);
      color: var(--primary-color-base);
    }

    fd-label {
      --fd-label-font-size: var(--font-size-fluid-0);
    }

    .slot {
      padding-inline-start: var(--fd-section-padding-inline-start);
      padding-inline-end: var(--fd-section-padding-inline-start);
    }
  `

  @property()
    heading?: string;

  @property()
    fullWidth?: boolean = false;

  render() {
    return html`
      <section data-full-width=${this.fullWidth}>
        <div class="header">
          ${this.heading && html`
            <h2>${this.heading}</h2>
            ${html`<fd-label>Read More</fd-label>`}
          `}
        </div>
        <div class="slot">
          <slot />
        </div>
      </section>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-section': Section
  }
}
