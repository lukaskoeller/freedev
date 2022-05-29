import { css, LitElement, render } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { html, literal } from 'lit/static-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlMixin } from '../mixins/formControlMixin';

export enum Tags {
  Button = 'button',
  Anchor = 'a',
};

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 * @cssprop {string} --fd-button-background-color - Adjusts the background-color
 */
@customElement('fd-button')
export class Button extends FormControlMixin(LitElement) {
  static styles = css`
    :host([disabled]) {
      pointer-events: none;
    }  

    :is(button, a) {
      --fd-button-background-color-default: var(--color-link);
      --fd-button-background-color-default--hover: var(--color-link-hover);
      --fd-button-color-default: var(--color-on-primary);
      --fd-button-color-default--hover: var(--color-on-primary);
      
      --fd-button-padding-inline-default: var(--size-6);
      --fd-button-block-size-default: var(--size-8);
      --fd-button-font-size-default: var(--font-size-1);

      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: var(--space-3);      

      min-block-size: var(--fd-button-block-size, var(--fd-button-block-size-default));
      padding-inline: var(--fd-button-padding-inline, var(--fd-button-padding-inline-default));

      font-weight: var(--font-weight-6);
      font-size: var(--fd-button-font-size, var(--fd-button-font-size-default));
      color: var(--fd-button-color, var(--fd-button-color-default));

      appearance: none;
      border: none;
      text-decoration: none;

      background-color: var(--fd-button-background-color, var(--fd-button-background-color-default));
      border-radius: var(--radius-round);
      
      touch-action: manipulation;
      cursor: pointer;
    }
    
    :is(button, a):hover {
      background-color: var(--fg-button-background-color--hover, var(--fd-button-background-color-default--hover));
      color: var(--fd-button-color--hover, var(--fd-button-color-default--hover));
    }
    
    :is(button, a)[data-variant="light"] {
      --fd-button-background-color-default: var(--light-color-base);
      --fd-button-background-color-default--hover: var(--light-color-base);
      --fd-button-color-default: var(--primary-color-base);
      --fd-button-color-default--hover: var(--primary-color-5);
    }
    
    :is(button, a)[data-variant="stealth"] {
      --fd-button-background-color-default: transparent;
      --fd-button-background-color-default--hover: transparent;
      --fd-button-color-default: var(--primary-color-5);
      --fd-button-color-default--hover: var(--primary-color-4);
    }
    
    :is(button, a)[data-size="small"] {
      --fd-button-padding-inline-default: var(--size-3);
      --fd-button-block-size-default: var(--size-7);
      --fd-button-font-size-default: var(--font-size-0);
    }

    ::slotted(button[slot="proxy"]) {
      display: none;
    }
  `

  private isLink: boolean = false;

  @property()
  variant: "default" | "light" | "stealth" = "default";

  @property()
  size: "default" | "small" = "default";

  @property()
  href?: string;

  @property()
  target?: "_self" | "_blank" | "_parent" | "_top" = "_self";

  @property()
  download?: boolean = false;

  @property()
  type?: HTMLButtonElement["type"] = 'submit';

  private getTag() {
    this.isLink = !!this.href;
    return this.isLink ? literal`a` : literal`button`;
  }

  private onClick() {
    if (this.type === "submit") {
      (this._proxyItems[0] as HTMLButtonElement).click();
    }
  }

  @queryAssignedElements({slot: 'proxy', selector: 'button[slot="proxy"]'})
  _proxyItems!: Array<HTMLButtonElement>;

  updated() {
    if (this.type === "submit") {
      render(html`
        <button
          slot="proxy"
          name=${ifDefined(!this.isLink ? this.name : undefined)}
          value=${ifDefined(!this.isLink ? this.value : undefined)}
          type=${ifDefined(!this.isLink ? this.type : undefined)}
          ?disabled=${ifDefined(!this.isLink ? this.disabled : undefined)}
        ></button>
      `, this);
    }
  }

  render() {
    return html`
      <slot name="proxy"></slot>
      <${this.getTag()}
        part="button"
        data-variant=${this.variant}
        data-size=${this.size}
        name=${ifDefined(!this.isLink ? this.name : undefined)}
        value=${ifDefined(!this.isLink ? this.value : undefined)}
        type=${ifDefined(!this.isLink ? this.type : undefined)}
        ?disabled=${ifDefined(!this.isLink ? this.disabled : undefined)}
        href=${ifDefined(this.isLink ? this.href : undefined)}
        target=${ifDefined(this.isLink ? this.target : undefined)}
        ?download=${ifDefined(this.isLink ? this.download : undefined)}
        @click=${this.onClick}
      >
        <slot></slot>
      </${this.getTag()}>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-button': Button
  }
}
