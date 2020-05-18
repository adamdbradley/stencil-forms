import { ControlData, ControlElement, ReactiveFormControl, ReactiveFormControlGroup } from '../types';

export const state = {
  i: 0,
};

export const instanceIdsMap = /*@__PURE__*/ new WeakMap<any, number>();

export const ctrlElmIdsMap = /*@__PURE__*/ new WeakMap<ControlElement, string>();

export const ctrlElmsMap = /*@__PURE__*/ new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, ControlElement>();

export const enum LabellingType {
  labelledby,
  errormessage,
  describedby,
}

/**
 * Follows LabellingType index
 */
export const labellingElmsMap = [
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
  new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, HTMLElement>(),
];

export const ctrlChildrenMap = /*@__PURE__*/ new WeakMap<
  ReactiveFormControl | ReactiveFormControlGroup,
  Map<string, { ctrl: ReactiveFormControl; data: ControlData }>
>();

export const groupItemLabellingElmParentCtrlMap = /*@__PURE__*/ new WeakMap<HTMLElement, ReactiveFormControlGroup>();

export const ctrlGroupItemsMap = /*@__PURE__*/ new WeakMap<ReactiveFormControl | ReactiveFormControl>();

export const ctrlMap = /*@__PURE__*/ new WeakMap<ControlElement, ReactiveFormControl | ReactiveFormControlGroup>();

export const ctrlDataMap = /*@__PURE__*/ new WeakMap<ReactiveFormControl, ControlData>();

export const debounceMap = /*@__PURE__*/ new WeakMap<ControlElement, any>();
