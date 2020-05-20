import { ControlData, ControlElement, ReactiveFormControl } from './types';
export declare const checkValidity: (ctrlData: ControlData, ctrlElm: ControlElement, ev: Event, cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void) => any;
export declare const validationMessage: (ctrl: ReactiveFormControl) => string;
export declare const activeValidatingMessage: (ctrl: ReactiveFormControl) => string;
export declare const isActivelyValidating: (ctrl: ReactiveFormControl) => boolean;
export declare const isValid: (ctrl: ReactiveFormControl) => boolean;
export declare const isInvalid: (ctrl: ReactiveFormControl) => boolean;
