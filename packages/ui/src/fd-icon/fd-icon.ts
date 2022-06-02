import { html, css, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, query } from 'lit/decorators.js';
import '../fd-label/fd-label';
import { Size } from 'types/index';

const SizeMap = {
  [Size.Xs]: 'var(--size-3)',
  [Size.Sm]: 'var(--size-4)',
  [Size.Md]: 'var(--size-5)',
  [Size.Lg]: 'var(--size-6)',
  [Size.Xl]: 'var(--size-7)',
}

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Generalized section component
 *
 * @prop {string} file - A svg file as string (see https://vitejs.dev/guide/features.html#static-assets)
 * @prop {string} file - Sets the size of the icon based on a enum value.
 * @cssprop {string} --fd-icon-size - Sets the inline and block size
 * @cssprop {string} --fd-icon-fill - Sets the fill color and defaults to currentcolor
 */
@customElement('fd-icon')
export class Icon extends LitElement {
  static styles = css`
    svg {
      display: block;
      inline-size: var(--fd-icon-size, var(--size));
      block-size: var(--fd-icon-size, var(--size));
    }

    svg path {
      fill: var(--fd-icon-fill, currentcolor);
    }
  `

  @property()
    file?: string;

  @property()
    size?: Size = Size.Md;

  @query('svg') private svg!: SVGSVGElement|null;

  render() {
    return html`
      ${unsafeHTML(this.file)}
    `
  }

  async firstUpdated() {
    // await the async render of unsafeHTML
    requestAnimationFrame(() => {
      if (this.size && this.svg) {
        this.svg.setAttribute('style', `--size: ${SizeMap[this.size]};`);
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-icon': Icon
  }
}
