import { ControlData, ControlElement, ReactiveFormControl, ReactiveFormControlGroup, ControlState } from '../types';
import { getRenderingRef } from '@stencil/core';
import { createStore } from '@stencil/store';

export const state = {
  /**
   * Unique id incrementer
   */
  i: 0,

  /**
   * last rendering ref
   */
  r: null,
};

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

export const InstanceId = /*@__PURE__*/ Symbol();

const CurrentControlIndex = /*@__PURE__*/ Symbol();

export const Control = /*@__PURE__*/ Symbol();

const ControlStates = /*@__PURE__*/ Symbol();

export const setControlState = (ctrlData: ControlData) => {
  const renderingRef = getRenderingRef();
  const ctrlStates: ControlState[] = (renderingRef[ControlStates] = renderingRef[ControlStates] || []);

  if (state.r !== renderingRef) {
    state.r = renderingRef;
    ctrlData.x = renderingRef[CurrentControlIndex] = 0;
  } else {
    ctrlData.x = ++renderingRef[CurrentControlIndex];
  }

  if (ctrlData.x === ctrlStates.length) {
    ctrlStates.push(
      createStore<ControlState>({
        validatingMessage: '',
        validationMessage: '',
      }).state,
    );
  }

  return ctrlStates[ctrlData.x];
};

export const getControlState = (ctrl: ReactiveFormControl): ControlState => {
  let renderingRef = getRenderingRef();
  let ctrlData: ControlData;
  let ctrlStates: ControlState[];
  let ctrlElm: ControlElement;
  let ctrlState: ControlState;

  if (renderingRef) {
    ctrlData = ctrlDatas.get(ctrl);
    if (ctrlData) {
      ctrlStates = renderingRef[ControlStates];
      if (ctrlStates) {
        ctrlState = ctrlStates[ctrlData.x];
        if (ctrlState) {
          return ctrlState;
        }
      }
    }
  }

  ctrlElm = ctrlElms.get(ctrl);
  if (ctrlElm && ctrlElm[Control]) {
    return ctrlElm[Control];
  }

  return null;
};
