import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { FormControlMixin } from '@open-wc/form-control';

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
      --fd-input-background-color: var(--primary-color-1);
      --fd-input-text-transform: uppercase;
      --fd-input-font-weight: var(--font-weight-6);
      --fd-input-font-size: var(--font-size-0);

      display: grid;
      gap-row: var(--size-3);
    }

    input {
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
  `

  // static get formAssociated() {
  //   return true;
  // }

  // constructor() {
  //   super();
  //   this.value = '';
  // }

  @property({ type: String })
  value = '';

  @property({ type: HTMLInputElement.prototype.placeholder })
  placeholder = '';

  @property({ type: HTMLInputElement.prototype.type })
  type = '';

  render() {
    return html`
      <label for="input"><slot></slot></label>
      <input
        id="input"
        .value="${live(this.value)}"
        ${this.type ? `.type=${this.type}` : ''}
        ${this.placeholder ? `.placeholder=${this.placeholder}` : ''}
        @input="${this.#onInput}"
      >
    `;
  }

  #onInput({ target }: { target: HTMLInputElement }): void {
    this.value = target.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-input': Input
  }
}
