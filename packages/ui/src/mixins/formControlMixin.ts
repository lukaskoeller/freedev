import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { addListener } from "../controllers/event-controller";
import './formdata-event-polyfill';

export type Constructor<T> = new (...args: any[]) => T;

export declare class FormControlMixinInterface {
  name: string;
  value: string;
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
      private associatedForm: HTMLFormElement | null = null;
      private boundOnSubmit = this.onSubmit.bind(this);
  
      @property({type: String}) name = '';
      @property({type: String}) value = '';

      onInput(e: InputEvent) {
        const target = e.target as HTMLInputElement
        this.value = target.value;
      }

      connectedCallback(): void {
          super.connectedCallback();

          addListener(this, 'keydown', (event: Event) => {
            if ((event as KeyboardEvent).code === 'Enter') {
              this.associatedForm?.requestSubmit();
            }
          });

          this.associatedForm = this.closest('form');
          if(this.associatedForm) {
            this.associatedForm.addEventListener('formdata', this.boundOnSubmit);
          }
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        if (this.associatedForm) {
          this.associatedForm.removeEventListener('formdata', this.boundOnSubmit);
        }
      }

      private onSubmit(event: FormDataEvent) {
        // Do validity check here
        // this.customValidity();

        // @todo Also adds checkbox data even if :not(:checked)
        event.formData.append(this.name, this.value)
      }
    };
  return FormControl as Constructor<FormControlMixinInterface> & T;
};