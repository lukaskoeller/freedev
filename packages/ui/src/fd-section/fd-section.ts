import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '../fd-label/fd-label';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SlotController } from '../controllers/slot-controller';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Generalized section component
 *
 * @slot - Content of the section
 * @cssprop {string} --fd-section-padding-inline
 * @cssprop {string} --fd-section-padding-inline-start
 * @cssprop {string} --fd-section-padding-inline-end
 * @cssprop {string} --fd-section-padding-block
 */
@customElement('fd-section')
export class Section extends LitElement {
  static styles = css`
    :host {
      --fd-section-padding-inline: var(--global-spacing);
      --fd-section-padding-inline-start: var(--fd-section-padding-inline);
      --fd-section-padding-inline-end: var(--fd-section-padding-inline);
      --fd-section-padding-block: calc(var(--global-spacing) / 2);
    }

    section {
      display: grid;
      gap: var(--size-3);
      grid-template-columns: minmax(0, 1fr);
      padding-block: var(--fd-section-padding-block);
    }

    section[data-full-width="true"] {
      --fd-section-padding-inline-start: 0;
      --fd-section-padding-inline-end: 0;
    }
    
    fd-hr {
      --fd-hr-padding-inline: var(--fd-section-padding-inline);
      --fd-hr-margin-inline-start: var(--fd-section-padding-inline);
    }

    .header {
      box-sizing: border-box;
      inline-size: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding-inline: var(--fd-section-padding-inline);
    }

    h2 {
      margin-block: 0;
      font-size: var(--font-size-fluid-2);
      font-weight: var(--font-weight-5);
      color: var(--color-primary-base);
    }

    fd-label {
      --fd-label-font-size: var(--font-size-fluid-0);
    }

    .slot {
      padding-inline-start: var(--fd-section-padding-inline-start);
      padding-inline-end: var(--fd-section-padding-inline-start);
    }
  `;

  actionSlot = new SlotController(this, 'actions');

  @property()
    heading?: string;

  @property()
    fullWidth?: boolean = false;

  @property()
    hasBorder?: boolean = false;

  render() {
    return html`
      <section data-full-width=${ifDefined(this.fullWidth)} part="section">
        ${this.hasBorder ? html`<fd-hr />` : null}
        <div class="header">
          ${this.heading ? html`<h2>${this.heading}</h2>` : null}
            ${this.actionSlot.hasContent ? html`
              <div>
                <slot name="actions"></slot>
              </div>
            ` : null}
        </div>
        <div class="slot">
          <slot></slot>
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
