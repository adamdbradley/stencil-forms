import { ControlData, ControlElement, ReactiveFormControl } from './types';
export declare const checkValidity: (ctrlData: ControlData, ctrlElm: ControlElement, ev: any, cb: ((ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: any) => void) | null) => any;
/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns the message provided by the browser and
 * the custom validation method will not be called. If the value does
 * pass constraint validation then the custom `validation()` method
 * will be called and returns the message. If the value passes both the
 * constraint validation and custom valdation, then this method returns
 * and empty string.
 */
export declare const validationMessage: (ctrl: ReactiveFormControl) => string;
/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return the message provided in `validatingMessage`.
 * All other times this method will return an empty string.
 */
export declare const activelyValidatingMessage: (ctrl: ReactiveFormControl) => string;
/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return `true` if the validation method is still pending.
 * All other times this method will return `false`.
 */
export declare const isActivelyValidating: (ctrl: ReactiveFormControl) => boolean;
/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `false` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `false`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `true`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
export declare const isValid: (ctrl: ReactiveFormControl) => boolean | null;
/**
 * If the value has changed or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `true` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `true`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `false`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
export declare const isInvalid: (ctrl: ReactiveFormControl) => boolean | null;
/**
 * When the user changes the value of the form control element, the
 * control is "dirty" and this method returns `true`. If control's
 * initial value has not changed then this method returns `false`.
 */
export declare const isDirty: (ctrl: ReactiveFormControl) => boolean;
/**
 * When the user blurs the form control element, the control is
 * marked as "touched" and this method returns `true`. If the
 * control has not had a blur event then this method will return
 * `false`.
 */
export declare const isTouched: (ctrl: ReactiveFormControl) => boolean;
