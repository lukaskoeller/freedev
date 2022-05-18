import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { FormControlMixin } from '../mixins/formControlMixin';

/**
 * https://css-tricks.com/supercharging-built-in-elements-with-web-components-is-easier-than-you-think/
 * https://github.com/WICG/webcomponents/issues/509
 * https://github.com/open-wc/form-participation/tree/main/packages/form-control
 * https://github.com/material-components/material-web/blob/master/packages/textfield/mwc-textfield-base.ts
 * https://github.com/lit/lit-element/issues/879
 */

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Input component for text
 *
 * @slot - Text of label
 * @cssprop {string} --fd-input-color - Adjusts text color
 * @cssprop {string} --fd-input-text-transform - Adjusts how text is transformed (see https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * @cssprop {string} --fd-input-font-weight - Adjusts font weight (see https://open-props.style/#typography)
 * @cssprop {string} --fd-input-font-size - Adjusts font size (see https://open-props.style/#typography)
 */
@customElement('fd-input')
export class Input extends FormControlMixin(LitElement) {
  static styles = css`
    :host {
      --fd-input-background-color: var(--color-surface-2);
      --fd-input-text-transform: uppercase;
      --fd-input-font-weight: var(--font-weight-6);
      --fd-input-font-size: var(--font-size-0);

      display: grid;
      gap-row: var(--size-3);
    }

    input {
      position: relative;
      min-width: 0;
      border: 0;
      border-radius: var(--radius-2);
      background-color: var(--fd-input-background-color);
      padding-inline: var(--size-4);
      padding-block: var(--size-3);

      font-family: var(--font-sans);
      font-weight: var(--font-weight-5);
      font-size: var(--font-size-1);
      color: var(--primary-color-base);
    }

    input:focus-visible {
      outline-color: var(--primary-color-0);
    }
  `

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: String, reflect: true })
  placeholder = '';

  @property({ type: String })
  type = 'text';

  render() {
    return html`
      <fd-label for="input"><slot></slot></fd-label>
      <slot>
        <input
          id="input"
          name=${this.name}
          .type="${this.type}"
          .placeholder="${this.placeholder}"
          .value="${this.value}"
          @input=${this.onInput}
        >
      </slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-input': Input
  }
}
