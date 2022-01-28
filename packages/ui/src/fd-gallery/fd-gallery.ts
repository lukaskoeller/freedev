import { html, css, LitElement } from 'lit'
import { customElement, queryAssignedElements } from 'lit/decorators.js'

//See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 * @cssprop {string} --fd-button-background-color - Adjusts the background-color
 */
@customElement('fd-gallery')
export class Gallery extends LitElement {
    // @todo: save position in between pages?
    // @todo: implement arrow controls?

    static styles = css`
      ul {
        --gap-default: var(--size-6);
        --padding-default: 0;

        display: flex;
        gap: calc(var(--gap, var(--gap-default)) / 2);
        margin: 0;
        max-inline-size: 100%;
        block-size: var(--size, auto);
        padding-inline-start: var(--padding, var(--padding-default));
        padding-inline-end: var(--padding, var(--padding-default));
        padding-block-start: calc(var(--padding, var(--padding-default)) / 2);
        padding-block-end: calc(var(--padding, var(--padding-default)) / 2);
        overflow-x: auto;
        overscroll-behavior-inline: contain;
        scroll-snap-type: inline mandatory;
        scroll-padding-left: var(--gap, var(--gap-default));
        scroll-padding-right: var(--gap, var(--gap-default));
        scroll-padding-inline: var(--gap, var(--gap-default));
        list-style: none;

        @media (prefers-reduced-motion: no-preference) {
          scroll-behavior: smooth;
        }
      }
      
      li {
          display: inline-block;
          scroll-snap-align: start;
          flex-shrink: 0;
      }
    `

    @queryAssignedElements() _listItems!: HTMLElement[];

    firstUpdated() {
        this.requestUpdate()
    }


    render() {
        return html`
            <ul>
                <slot></slot>
                ${this._listItems?.map((item) => html`
                    <li>
                        ${item}
                    </li>
                `)}
            </ul>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fd-gallery': Gallery
    }
}
