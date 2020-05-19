import { ControlData, ControlElement, ReactiveFormControl, ReactiveFormControlGroup } from '../types';
export declare const state: {
    i: number;
};
export declare const instanceIds: WeakMap<any, number>;
export declare const ctrlElmIds: WeakMap<ControlElement, string>;
export declare const ctrlElms: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, ControlElement>;
export declare const enum LabellingType {
    labelledby = 0,
    errormessage = 1,
    describedby = 2
}
/**
 * Follows LabellingType index
 */
export declare const labellingElms: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>[];
export declare const ctrlChildren: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, Map<string, {
    ctrl: ReactiveFormControl;
    data: ControlData;
}>>;
export declare const ctrls: WeakMap<ControlElement, ReactiveFormControl | ReactiveFormControlGroup>;
export declare const ctrlDatas: WeakMap<ReactiveFormControl, ControlData>;
export declare const debounces: WeakMap<ControlElement, any>;
