import { ReactiveFormControl, ControlElement } from './types';
export declare const setDescribedbyAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => string;
export declare const setErrormessageAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void;
export declare const setLabelledbyAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void;
export declare const descriptionFor: (ctrl: ReactiveFormControl, groupItemValue?: string) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
export declare const validationFor: (ctrl: ReactiveFormControl, groupItemValue?: string) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
export declare const labelFor: (ctrl: ReactiveFormControl, groupItemValue?: string) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
export declare const getGroupChild: (parentCtrl: ReactiveFormControl, groupItemValue: string) => {
    ctrl: ReactiveFormControl;
    data: import("./types").ControlData;
};
