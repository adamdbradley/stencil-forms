import { ControlElement, ReactiveFormControl, ControlData } from './types';
export declare const checkValidity: (ctrlData: ControlData, ctrlElm: ControlElement, ev: Event, cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void) => any;
export declare const isValidating: (_ctrl: ReactiveFormControl) => boolean;
export declare const isValid: (_ctrl: ReactiveFormControl) => boolean;
export declare const isInvalid: (_ctrl: ReactiveFormControl) => boolean;
export declare const validationMessage: (_ctrl: ReactiveFormControl) => void;
