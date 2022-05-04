import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export type Constructor<T> = new (...args: any[]) => T;

export declare class FormControlMixinInterface {
  name: string;
  value: string;
  checked: boolean;
}

export const FormControlMixin = 
  <T extends Constructor<LitElement>>(superClass: T) => {
    class FormControl extends superClass {
  
    @property({type: String}) name = '';
    @property({type: String}) value = '';
    @property({type: Boolean}) checked = false;

  };
  return FormControl as Constructor<FormControlMixinInterface> & T;
};