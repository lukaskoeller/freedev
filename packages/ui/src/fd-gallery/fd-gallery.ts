import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Displays its items in a horizontal stack and enables scrolling
 * if items overflow its container.
 *
 * @slot - Must only contain <fd-gallery-item> components
 * @cssprop {string} --fd-gallery-padding - Adjusts padding of gallery
 * @cssprop {string} --fd-gallery-gap - Adjusts gap between items
 */
@customElement('fd-gallery')
export class Gallery extends LitElement {
    // @todo: save position in between pages?
    // @todo: implement arrow controls?

    static styles = css`
      :host {
        --fd-gallery-gap: var(--size-6);
        --fd-gallery-padding: 0;
        --fd-gallery-block: 0;
      }

      ul {
        display: flex;
        gap: calc(var(--fd-gallery-gap) / 2);
        margin: 0;
        max-inline-size: 100%;
        block-size: var(--size, auto);
        padding-inline-start: var(--fd-gallery-padding);
        padding-inline-end: var(--fd-gallery-padding);
        padding-block-start: calc(var(--fd-gallery-block) / 2);
        padding-block-end: calc(var(--fd-gallery-block) / 2);
        overflow-x: auto;
        overscroll-behavior-inline: contain;
        scroll-snap-type: inline mandatory;
        scroll-padding-left: var(--fd-gallery-padding);
        scroll-padding-right: var(--fd-gallery-padding);
        scroll-padding-inline: var(--fd-gallery-padding);
        list-style: none;

        @media (prefers-reduced-motion: no-preference) {
          scroll-behavior: smooth;
        }
      }
      
      ::slotted(li) {
          display: inline-block;
          scroll-snap-align: start;
          flex-shrink: 0;
      }
    `

    // _listItems(): Node[] {
    //     return Array.from(this.querySelectorAll("*")).map(x => x.cloneNode(true));
    // }

    render() {
        return html`
            <ul>
                <slot></slot>
            </ul>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fd-gallery': Gallery
    }
}
