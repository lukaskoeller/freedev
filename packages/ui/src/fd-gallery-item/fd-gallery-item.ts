import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Displays its items in a horizontal stack and enables scrolling
 * if items overflow its container.
 *
 * @slot - Contains the content of the item
 * @cssprop {string} --padding - Adjusts padding of gallery
 * @cssprop {string} --gap - Adjusts gap between items
 */
@customElement('fd-gallery-item')
export class GalleryItem extends LitElement {
    static styles = css`
      :host {
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
            <li>
                <slot></slot>
            </li>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fd-gallery-item': GalleryItem
    }
}
