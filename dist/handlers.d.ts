import { ControlElement, ControlData } from './types';
export declare const sharedOnInvalidHandler: (ev: Event) => void;
export declare const sharedOnValueChangeHandler: (ev: InputEvent) => void;
export declare const sharedOnKeyDownHandler: (ev: KeyboardEvent) => void;
export declare const sharedOnFocus: (ev: FocusEvent) => void;
export declare const getValueFromControlElement: (ctrlData: ControlData, ctrlElm: ControlElement) => string | number | boolean;
