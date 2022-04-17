import { LitElement } from 'lit'
import {html, literal} from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { labelStyles } from './fd-label.style';

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
  static styles = labelStyles;

  @property()
  tag: Tags = Tags.Label;

  @property()
  for: string = 'input';

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
      <${this.getTag(this.tag)} class="label" part="label" for=${this.for}>
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
