import { css, LitElement } from 'lit'
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';

// See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc
// See https://www.npmjs.com/package/@custom-elements-manifest/analyzer
/**
 * Extended form element to allow cross-browser form participation of custom elements
 * @url https://web.dev/more-capable-form-controls/
 *
 * @cssprop {string} --fd-form-margin-inline-start - Adjusts margin inline start
 * @cssprop {string} --fd-form-padding-inline - Adjusts padding inline
 */
@customElement('fd-form')
export class Form extends LitElement {
  static styles = css`
    :host {
      --fd-form-gap: var(--size-3);
      --fd-form-justify-items: stretch;
    }
  `

  constructor() {
    super();
    this.addEventListener(
      'formdata', (e) => console.log(e.type, (e.target as HTMLInputElement).localName)
    );
    this.addEventListener(
      'click', (e) => console.log(e.type, (e.target as HTMLInputElement).localName)
    );
  }

  render() {
    return html`
      <form @submit=${this._formdata}>
        <button type="submit">Submit Form</button>
        <slot />
      </form>
    `
  }

  _formdata(e) {
    e.preventDefault();
    console.log('formdata');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fd-form': Form
  }
}
