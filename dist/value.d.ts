import type { ControlElement, ControlData } from './types';
export declare const getValueFromControlElement: (ctrlData: ControlData, ctrlElm: ControlElement) => any;
export declare const setValueToControlElement: (ctrlData: ControlData, ctrlElm: ControlElement, value: any) => void;
export declare const getValuePropName: (ctrlData: ControlData, ctrlElm: ControlElement) => string;
export declare const setCastedBindValue: (instance: any, propName: string, value: any) => void;
