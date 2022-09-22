import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '../fd-label/fd-label';
import { Size } from 'types';
import { ifDefined } from 'lit/directives/if-defined';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * General wrapper providing basic inline and block padding
 *
 * @slot - Content of the container
 * @property {Size} size - Sets the width according to given value and disables padding inline
 * @csspart container - Styles the Container's section
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
      --fd-container-padding-block: calc(var(--global-spacing) / 2);

      --fd-container-inline-size: auto;
      --fd-container-margin-inline: 0;
    }

    section {
      box-sizing: border-box;
      inline-size: min(var(--fd-container-inline-size, fit-content), 100%);
      margin-inline: var(--fd-container-margin-inline);
      padding-inline-start: var(--fd-container-padding-inline-start, var(--fd-container-padding-inline));
      padding-inline-end: var(--fd-container-padding-inline-end, var(--fd-container-padding-inline));
      padding-block: var(--fd-container-padding-block);
    }

    section[data-size="xs"] {
      --fd-container-inline-size: calc(1 * var(--size-15));
      --fd-container-padding-inline: 0px;
      --fd-container-margin-inline: auto;
    }

    section[data-size="sm"] {
      --fd-container-inline-size: calc(1.5 * var(--size-15));
      --fd-container-padding-inline: 0px;
      --fd-container-margin-inline: auto;
    }

    section[data-size="md"] {
      --fd-container-inline-size: calc(2 * var(--size-15));
      --fd-container-padding-inline: 0px;
      --fd-container-margin-inline: auto;
    }

    section[data-size="lg"] {
      --fd-container-inline-size: calc(3 * var(--size-15));
      --fd-container-padding-inline: 0px;
      --fd-container-margin-inline: auto;
    }

    section[data-size="xl"] {
      --fd-container-inline-size: calc(4 * var(--size-15));
      --fd-container-padding-inline: 0px;
      --fd-container-margin-inline: auto;
    }
  `

  @property({type: String})
  size?: Size;

  render() {
    return html`
      <section part="container" data-size=${ifDefined(this.size)}>
        <slot></slot>
      </section>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-container': Container
  }
}
