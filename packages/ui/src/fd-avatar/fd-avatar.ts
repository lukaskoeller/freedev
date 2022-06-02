import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Size } from 'types/index';

const SizeMap = {
  [Size.Xs]: 'var(--size-6)',
  [Size.Sm]: 'var(--size-7)',
  [Size.Md]: 'var(--size-8)',
  [Size.Lg]: 'var(--size-9)',
  [Size.Xl]: 'var(--size-10)',
}

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * An Avatar component.
 *
 * @slot This element has a slot
 * @csspart Avatar - Styles the Avatar's div
 * @cssprop --fd-avatar-background-color - Adjusts the background color
 * @cssprop --fd-avatar-color - Adjusts the font color
 * @cssprop --fd-avatar-border-color - Adjusts the border color
 * @cssprop --fd-avatar-size - Sets the size of the avatar
 * @cssprop --fd-avatar-border-radius - Sets the border radius. Default is round
 */
@customElement('fd-avatar')
export class Avatar extends LitElement {
  static styles = css`
    :host {
      --fd-avatar-background-color: var(--color-surface-2);
      --fd-avatar-color: var(--text-1);
      --fd-avatar-border-color: var(--color-border);
      --fd-avatar-border-radius: var(--radius-round);
    }

    div {
      display: grid;
      place-items: center;
      box-sizing: border-box;
      overflow: hidden;
      inline-size: var(--fd-avatar-size, var(--size));
      block-size: var(--fd-avatar-size, var(--size));
      color: var(--fd-avatar-color, inherit);
      border: 2px solid var(--fd-avatar-border-color);
      border-radius: var(--fd-avatar-border-radius);
      background-color: var(--fd-avatar-background-color);
    }

    ::slotted(img) {
      object-fit: cover;
    }
  `

  @property({ type: String })
  name!: string;

  @query('img') private img!: HTMLImageElement|null;

  @property({ type: String })
  size?: Size;

  render() {
    return html`
      <div part="avatar" style="--size: ${SizeMap[
        this.size ?? Size.Xs
      ]};">
        <slot>
          ${this.name?.charAt(0) ?? ''}
        </slot>
      </div>
    `
  }

  async firstUpdated() {
    // await the async render of unsafeHTML
    requestAnimationFrame(() => {
      if (this.name && this.img) {
        this.img.setAttribute('alt', this.name);
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-avatar': Avatar
  }
}
