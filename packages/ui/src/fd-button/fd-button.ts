import { css, LitElement, render } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { html, literal } from 'lit/static-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlMixin } from '../mixins/formControlMixin';
import { Size, Status } from 'types';
import '../fd-icon/fd-icon';
import svgCircleNotchSolid from 'assets/icons/circle-notch-solid.svg?raw';

export enum ButtonTags {
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
 * @cssprop {string} --fd-button-background-color--host - Adjusts the background-color hover state
 * @cssprop {string} --fd-button-color - Adjusts the text color
 * @cssprop {string} --fd-button-color--hover - Adjusts the text color hover state
 */
@customElement('fd-button')
export class Button extends FormControlMixin(LitElement) {
  static styles = css`
    :host {
      --fd-button-background-color: var(--color-link);
      --fd-button-background-color--hover: var(--color-link-hover);
      --fd-button-color: var(--color-on-primary);
      --fd-button-color--hover: var(--color-on-primary);
      --fd-button-border-color: var(--color-link);
      
      --fd-button-font-size: var(--font-size-1);
      --fd-button-padding-inline: var(--size-6);
      --fd-button-block-size: calc(var(--size-6) + var(--fd-button-font-size));
      --fd-button-line-height: var(--font-lineheight-5);

      --fd-button-width: fit-content;
    }

    :is(button, a) {
      position: relative;
      box-sizing: inherit;
      inline-size: var(--fd-button-width, fit-content);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-3);      

      min-block-size: var(--fd-button-block-size);
      padding-inline: var(--fd-button-padding-inline);

      font-weight: var(--font-weight-6);
      font-size: var(--fd-button-font-size);
      line-height: var(--fd-button-line-height);
      text-align: center;
      color: var(--fd-button-color);

      appearance: none;
      border: none;
      text-decoration: none;

      background-color: var(--fd-button-background-color);
      border-radius: var(--radius-round);
      overflow: hidden;
      
      touch-action: manipulation;
      cursor: pointer;
    }
    
    :is(button, a):hover {
      background-color: var(--fd-button-background-color--hover);
      color: var(--fd-button-color--hover);
    }
    
    :is(button, a)[data-variant="light"] {
      --fd-button-background-color: transparent;
      --fd-button-background-color--hover: transparent;
      --fd-button-color: var(--text-1);
      --fd-button-color--hover: var(--text-1);
      outline: var(--border-size-1) solid var(--fd-button-border-color);
    }
    
    :is(button, a)[data-variant="monotone"] {
      --fd-button-background-color: var(--color-surface-2);
      --fd-button-background-color--hover: var(--color-surface-2);
      --fd-button-color: var(--color-link);
      --fd-button-color--hover: var(--color-link);
    }

    :is(button, a)[data-variant="stealth"] {
      --fd-button-background-color: transparent;
      --fd-button-background-color--hover: transparent;
      --fd-button-color: var(--text-1);
      --fd-button-color--hover: var(--text-1);
    }

    :is(button, a)[data-size="sm"] {
      --fd-button-padding-inline: var(--size-3);
      --fd-button-block-size: var(--size-7);
      --fd-button-font-size: var(--font-size-0);
    }

    :is(button, a)[data-status="loading"] > [name="status"] {
      --fd-icon-size: 1.75em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      inline-size: 100%;
      block-size: 100%;
      background-color: var(--fd-button-background-color);
    }

    @keyframes spin {
      to {
        transform: rotate(1turn)
      }
    }

    :is(button, a)[data-expand] {
      --fd-button-width: 100%;
    }

    :is(button, a)[data-icon] {
      --fd-button-padding-inline: 0;
      --fd-button-width: var(--fd-button-block-size);
    }

    :host([disabled]) {
      pointer-events: none;
    }

    :is(button, a)[data-status="loading"] > [name="status"] > fd-icon {
      animation: var(--animation-spin);
      animation-duration: 1.1s;
    }

    ::slotted(button[slot="proxy"]) {
      display: none;
    }
  `

  statusIcon(status: Status | undefined) {
    switch (status) {
      case Status.Loading:
        return html`
          <fd-icon
            file=${svgCircleNotchSolid}
            size="inline"
          />`;
      default:
        return null // render nothing
    }
  }

  private isLink: boolean = false;

  @property()
  variant: "default" | "light" | "stealth" | "icon" = "default";

  @property()
  size?: Size.Sm;

  @property()
  status?: Status;

  @property({ type: Boolean, reflect: true })
  expand: boolean = false;

  @property({ type: Boolean, reflect: true })
  icon: boolean = false;

  @property({ type: Boolean, reflect: true })
  autofocus: boolean = false;

  @property()
  form?: string;

  @property()
  href?: string;

  @property()
  target?: "_self" | "_blank" | "_parent" | "_top" = "_self";

  @property({ type: Boolean, reflect: true })
  download?: boolean = false;

  @property()
  type?: HTMLButtonElement["type"] = 'submit';

  private getTag() {
    this.isLink = !!this.href;
    return this.isLink ? literal`a` : literal`button`;
  }

  private _onClick() {
    if (this.type === "submit") {
      (this._proxyItems[0] as HTMLButtonElement).click();
    }
  }

  @queryAssignedElements({slot: 'proxy', selector: 'button[slot="proxy"]'})
  _proxyItems!: Array<HTMLButtonElement>;

  updated() {
    if (this.type === "submit" || this.type === "button") {
      render(html`
        <button
          slot="proxy"
          name=${ifDefined(!this.isLink ? this.name : undefined)}
          value=${ifDefined(!this.isLink ? this.value : undefined)}
          type=${ifDefined(!this.isLink ? this.type : undefined)}
          form=${ifDefined(!this.isLink ? this.form : undefined)}
          ?autofocus=${this.autofocus}
          ?disabled=${!this.isLink ? this.disabled : undefined}
        >
          <slot></slot>
        </button>
      `, this);
    }
  }

  render() {
    return html`
      <slot name="proxy"></slot>
      <${this.getTag()}
        part="button"
        ?data-icon=${this.icon}
        ?data-expand=${this.expand}
        data-variant=${this.variant}
        data-size=${this.size}
        data-status=${this.status}
        ?aria-busy=${this.status === Status.Loading}
        ?autofocus=${this.autofocus}
        name=${ifDefined(!this.isLink ? this.name : undefined)}
        value=${ifDefined(!this.isLink ? this.value : undefined)}
        type=${ifDefined(!this.isLink ? this.type : undefined)}
        form=${ifDefined(!this.isLink ? this.form : undefined)}
        ?disabled=${ifDefined(!this.isLink ? this.disabled : undefined)}
        href=${ifDefined(this.isLink ? this.href : undefined)}
        target=${ifDefined(this.isLink ? this.target : undefined)}
        ?download=${ifDefined(this.isLink ? this.download : undefined)}
        @click=${this._onClick}
      >
        <slot></slot>
        <slot name="status">
          ${this.statusIcon(this.status)}
        </slot>
      </${this.getTag()}>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-button': Button
  }
}
