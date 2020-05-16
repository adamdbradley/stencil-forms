import { ControlElement, ReactiveFormControl, ReactiveFormControlOptions } from './types';
export declare const checkValidity: (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: Event, cb: (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: Event) => void) => any;
export declare const validationMessage: (_ctrl: ReactiveFormControl) => void;
