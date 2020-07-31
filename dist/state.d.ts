import type { ControlData, ControlElement, ControlState, ReactiveFormControl, ReactiveFormControlGroup } from './types';
export declare const state: {
    /**
     * Unique id incrementer
     */
    i: number;
    /**
     * last rendering ref
     */
    r: null;
};
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
export declare const inputDebounces: WeakMap<ControlElement, any>;
export declare const instanceIds: WeakMap<any, number>;
export declare const Control: unique symbol;
export declare const setControlState: (initialValue: any, ctrlData: ControlData) => ControlState | null;
export declare const getControlState: (ctrl: ReactiveFormControl) => ControlState;
