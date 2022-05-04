import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { labelStyles } from '../fd-label/fd-label.style';
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
 * Switch component for text
 *
 * @slot - Text of label
 * @cssprop {string} --fd-switch-color - Adjusts text color
 * @cssprop {string} --fd-switch-text-transform - Adjusts how text is transformed (see https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * @cssprop {string} --fd-switch-font-weight - Adjusts font weight (see https://open-props.style/#typography)
 * @cssprop {string} --fd-switch-font-size - Adjusts font size (see https://open-props.style/#typography)
 */
@customElement('fd-switch')
export class Switch extends FormControlMixin(LitElement) {
  static styles = [
    labelStyles,
    css`
      :host {
        --fd-switch-thumb-size: var(--size-6);
        --fd-switch-thumb: var(--light-color-base);
        
        --fd-switch-track-size: calc(var(--fd-switch-thumb-size) * 2);
        --fd-switch-track-padding: calc(var(--size-1) / 2);
        --fd-switch-track-inactive: var(--primary-color-2);
        --fd-switch-track-active: var(--primary-color-base);
      
        --fd-switch-thumb-color: var(--fd-switch-thumb);
        --fd-switch-track-color-inactive: var(--fd-switch-track-inactive);
        --fd-switch-track-color-active: var(--fd-switch-track-active);
      
        --fd-switch-isLTR: 1;
      }

      label {
        display: flex;
        align-items: center;
        gap: var(--size-4);
        justify-content: space-between;

        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      input {
        --fd-switch-thumb-position: 0%;
        --fd-switch-thumb-transition-duration: .25s;
        
        padding: var(--fd-switch-track-padding);
        background: var(--fd-switch-track-color-inactive);
        inline-size: var(--fd-switch-track-size);
        block-size: var(--fd-switch-thumb-size);
        border-radius: var(--fd-switch-track-size);

        appearance: none;
        -webkit-appearance: none;
        pointer-events: none;
        touch-action: pan-y;
        border: none;
        outline-offset: 5px;
        box-sizing: content-box;

        flex-shrink: 0;
        display: grid;
        align-items: center;
        grid: [track] 1fr / [track] 1fr;

        transition: background-color .25s ease;
      }

      input::before {
        --fd-switch-highlight-size: 0;

        content: "";
        cursor: pointer;
        pointer-events: auto;
        grid-area: track;
        inline-size: var(--fd-switch-thumb-size);
        block-size: var(--fd-switch-thumb-size);
        background: var(--fd-switch-thumb-color);
        border-radius: 50%;
        transition: transform .25s ease;
        transform: translateX(var(--fd-switch-thumb-position));
      }

      @media (--fd-switch-motionOK) { 
        input::before {
          transition: 
            transform var(--fd-switch-thumb-transition-duration) ease;
        }
      }

      input:not(:disabled):hover::before {
        --fd-switch-highlight-size: .5rem;
      }

      input:checked {
        background: var(--fd-switch-track-color-active);
        --fd-switch-thumb-position: calc((var(--fd-switch-track-size) - 100%) * var(--fd-switch-isLTR));
      }

      input:indeterminate {
        --fd-switch-thumb-position: calc(
          calc(calc(var(--fd-switch-track-size) / 2) - calc(var(--fd-switch-thumb-size) / 2))
          * var(--fd-switch-isLTR)
        );
      }

      input:disabled {
        cursor: not-allowed;
        --fd-switch-thumb-color: transparent;
      }

      input:disabled::before {
        cursor: not-allowed;
        box-shadow: inset 0 0 0 2px hsl(0 0% 100% / 50%);
      }

      @media (prefers-color-scheme: dark) {
        input:disabled::before {
          box-shadow: inset 0 0 0 2px hsl(0 0% 0% / 50%);
        }
      }
    `
  ];

  @property({ type: String, reflect: true })
  placeholder = '';

  render() {
    return html`
      <label for="input" class="label" part="label">
        <input
          id="input"
          role="switch"
          type="checkbox"
          name=${this.name}
          .value=${this.value}
          .checked=${this.checked}
          @input=${this.handleInput}
        >
        <slot />
      </label>
    `;
  }

  private handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement
    this.checked = target.checked;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-switch': Switch
  }
}
