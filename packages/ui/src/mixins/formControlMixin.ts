import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { addListener } from "../controllers/event-controller";
import './formdata-event-polyfill';

export type Constructor<T> = new (...args: any[]) => T;

export declare class FormControlMixinInterface {
  name?: string;
  value?: string;
  disabled?: boolean;
  onInput(event: InputEvent): void;
}

/**
 * 
 * @param superClass 
 * @returns the form control class that comes with input and form handling functionality.
 * 
 * Inspired by @url https://twitter.com/techytacos/status/1408184381491933184
 */
export const FormControlMixin = 
  <T extends Constructor<LitElement>>(superClass: T) => {
    class FormControl extends superClass {
      private boundOnSubmit = this.onSubmit.bind(this);
      private _form: HTMLFormElement | null = null;

      @property({type: String}) name?: string;
      @property({type: String}) value?: string = '';
      @property({type: Boolean}) disabled: boolean = false;

      protected get form(): HTMLFormElement | null { 
        if (this.hasAttribute("form")) {
          const root = this.getRootNode() as ShadowRoot | Document
          this._form = root.querySelector(`form#${this.getAttribute("form")}`)
          return this._form;
        }
      
        this._form = this.closest("form");
        return this._form;
      }

      protected set form(form: HTMLFormElement | null) {
        this._form = form;
      }

      onInput(e: InputEvent) {
        const target = e.target as HTMLInputElement
        this.value = target.value;
      }

      /**
       * @todo Extract addListener to FormSubmissionController?
       * @todo Extract formdata event to FormParticipationController?
       */
      connectedCallback(): void {
          super.connectedCallback();

          addListener(this, 'keydown', (event: Event) => {
            if ((event as KeyboardEvent).code === 'Enter') {
              this.form?.requestSubmit();
            }
          });

          if (this.form) {
            this.form.addEventListener('formdata', this.boundOnSubmit);
          }
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        if (this.form) {
          this.form.removeEventListener('formdata', this.boundOnSubmit);
        }
      }

      private onSubmit(event: FormDataEvent) {
        // Do validity check here
        // this.customValidity();

        // @todo Also adds checkbox data even if :not(:checked)
        if (this?.name && this?.value) {
          event.formData.append(this.name, this.value);
        }
      }
    };
  return FormControl as Constructor<FormControlMixinInterface> & T;
};