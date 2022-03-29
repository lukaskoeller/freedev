import { css, LitElement } from 'lit'
import {html, literal} from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';

export enum Tags {
  Label = 'label',
  Span = 'span',
  Div = 'div' 
};

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Label component for inputs or as usual div or span
 *
 * @slot - Text of label
 * @cssprop {string} --fd-label-color - Adjusts text color
 * @cssprop {string} --fd-label-text-transform - Adjusts how text is transformed (see https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * @cssprop {string} --fd-label-font-weight - Adjusts font weight (see https://open-props.style/#typography)
 * @cssprop {string} --fd-label-font-size - Adjusts font size (see https://open-props.style/#typography)
 */
@customElement('fd-label')
export class Label extends LitElement {
  static styles = css`
    :host {
      --fd-label-color-default: var(--primary-color-5);
      --fd-label-text-transform-default: uppercase;
      --fd-label-font-weight-default: var(--font-weight-6);
      --fd-label-font-size-default: var(--font-size-0);

      font-weight: var(--fd-label-font-weight, var(--fd-label-font-weight-default));
      font-size: var(--fd-label-font-size, var(--fd-label-font-size-default));
      text-transform: var(--fd-label-text-transform, var(--fd-label-text-transform-default));
      color: var(--fd-label-color, var(--fd-label-color-default));
    }
  `

  @property()
  tag: Tags = Tags.Label;

  private getTag(tag: Tags) {
    switch (tag) {
      case "label":
        return literal`label`;
      case "span":
        return literal`span`;
      case "div":
        return literal`div`;
      default:
        return literal`label`;
    }
  }

  render() {
    return html`
      <${this.getTag(this.tag)}>
        <slot></slot>
      </${this.getTag(this.tag)}>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-label': Label
  }
}
