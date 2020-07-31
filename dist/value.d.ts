import type { ControlElement, ControlData } from './types';
export declare const getValueFromControlElement: (ctrlData: ControlData, ctrlElm: ControlElement) => string | number | boolean;
export declare const setValueFromControlElement: (ctrlData: ControlData, ctrlElm: ControlElement, value: any) => string | boolean;
