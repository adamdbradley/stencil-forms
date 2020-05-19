import { ControlData, ControlElement, ReactiveFormControl, ReactiveFormControlGroup } from '../types';

export const state = {
  i: 0,
};

export const instanceIds = /*@__PURE__*/ new WeakMap<any, number>();

export const ctrlElmIds = /*@__PURE__*/ new WeakMap<ControlElement, string>();

export const ctrlElms = /*@__PURE__*/ new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, ControlElement>();

export const enum LabellingType {
  labelledby,
  errormessage,
  describedby,
}

/**
 * Follows LabellingType index
 */
export const labellingElms = [
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
];

export const ctrlChildren = /*@__PURE__*/ new WeakMap<
  ReactiveFormControl | ReactiveFormControlGroup,
  Map<string, { ctrl: ReactiveFormControl; data: ControlData }>
>();

export const ctrls = /*@__PURE__*/ new WeakMap<ControlElement, ReactiveFormControl | ReactiveFormControlGroup>();

export const ctrlDatas = /*@__PURE__*/ new WeakMap<ReactiveFormControl, ControlData>();

export const debounces = /*@__PURE__*/ new WeakMap<ControlElement, any>();
