import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export type Constructor<T> = new (...args: any[]) => T;

export declare class FormControlMixinInterface {
  name: string;
  value: string;
  checked: boolean;
  onInput(event: InputEvent): void;
}

export const FormControlMixin = 
  <T extends Constructor<LitElement>>(superClass: T) => {
    class FormControl extends superClass {
      private associatedForm: HTMLFormElement | null = null;
      private boundOnSubmit = this.onSubmit.bind(this);
  
      @property({type: String}) name = '';
      @property({type: String}) value = '';
      @property({type: Boolean}) checked = false;

      onInput(e: InputEvent) {
        const target = e.target as HTMLInputElement
        this.value = target.value;
      }

      connectedCallback(): void {
          super.connectedCallback();
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