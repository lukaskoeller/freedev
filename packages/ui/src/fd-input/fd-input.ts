import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { labelStyles } from '../fd-label/fd-label.style';
import { FormControlMixin } from '../mixins/formControlMixin';
import { captionStyles, errorStyles } from '../styles/shared';
import { ifDefined } from 'lit/directives/if-defined.js';

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
 * @csspart label - Assigned to the <label> element
 * @cssprop {string} --fd-input-color - Adjusts text color
 * @cssprop {string} --fd-input-text-transform - Adjusts how text is transformed (see https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * @cssprop {string} --fd-input-font-weight - Adjusts font weight (see https://open-props.style/#typography)
 * @cssprop {string} --fd-input-font-size - Adjusts font size (see https://open-props.style/#typography)
 */
@customElement('fd-input')
export class Input extends FormControlMixin(LitElement) {
  static styles = [
    labelStyles,
    captionStyles,
    errorStyles,
    css`
      :host {
        --fd-input-background-color: var(--color-surface-2);
        --fd-input-text-transform: uppercase;
        --fd-input-font-weight: var(--font-weight-6);
        --fd-input-font-size: var(--font-size-0);
        --fd-input-border-color: var(--color-border);

        display: grid;
        row-gap: calc(var(--size-1) / 2);
      }

      input {
        position: relative;
        min-width: 0;
        border: var(--border-size-1) solid var(--fd-input-border-color);
        border-radius: var(--radius-2);
        background-color: var(--fd-input-background-color);
        padding-inline: var(--size-4);
        padding-block: var(--size-3);

        font-family: var(--font-sans);
        font-weight: var(--font-weight-5);
        font-size: var(--font-size-1);
        color: var(--primary-color-base);
      }

      input[aria-invalid="true"] {
        --fd-input-border-color: var(--color-status-error);
        border: var(--border-size-1) solid var(--fd-input-border-color);
      }

      ::placeholder {
        color: var(--color-accent-6);
      }
    `
  ];

  @property({ type: String })
  label!: string;

  @property({ type: String, reflect: true })
  placeholder?: string;

  @property({ type: String })
  type: HTMLInputElement["type"] = 'text';

  @property({ type: String })
  error?: string;

  render() {
    return html`
      <label for="input" class="label" part="label">
        <slot name="label">${this.label}</slot>
      </label>
      <input
        id="input"
        type=${this.type}
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        placeholder=${this.placeholder ?? this.label}
        ?disabled=${this.disabled}
        @input=${this.onInput}
        spellcheck="false"
        aria-invalid=${ifDefined(!!this.error)}
        aria-describedby="error"
      >
      <div
        class="fd-error fd-caption"
        role="alert"
        id="error"
      >
        <slot name="error">
          ${this.error}
        </slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-input': Input
  }
}
