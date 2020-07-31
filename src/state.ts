import type { ControlData, ControlElement, ControlState, ReactiveFormControl, ReactiveFormControlGroup } from './types';
import { createStore } from '@stencil/store';
import { getRenderingRef } from '@stencil/core';

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

export const inputDebounces = /*@__PURE__*/ new WeakMap<ControlElement, any>();

export const instanceIds = /*@__PURE__*/ new WeakMap<any, number>();

const CurrentControlIndex = /*@__PURE__*/ Symbol();

export const Control = /*@__PURE__*/ Symbol();

const ControlStates = /*@__PURE__*/ Symbol();

export const setControlState = (initialValue: any, ctrlData: ControlData) => {
  const renderingRef = getRenderingRef();
  if (!renderingRef) {
    return null;
  }
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
        d: false,
        t: false,
        i: true,
        m: '',
        e: '',
        c: 0,
        v: initialValue,
      }).state,
    );
  }

  return ctrlStates[ctrlData.x];
};

export const getControlState = (ctrl: ReactiveFormControl): ControlState => {
  let renderingRef = getRenderingRef();
  let ctrlData: ControlData | undefined;
  let ctrlStates: ControlState[];
  let ctrlElm: ControlElement | undefined;
  let ctrlState: ControlState;

  if (renderingRef) {
    ctrlData = ctrlDatas.get(ctrl);
    if (ctrlData) {
      ctrlStates = renderingRef[ControlStates];
      if (ctrlStates) {
        ctrlState = ctrlStates[ctrlData.x!];
        if (ctrlState) {
          return ctrlState;
        }
      }
    }
  }

  ctrlElm = ctrlElms.get(ctrl);
  return ctrlElm ? (ctrlElm as any)[Control] : {};
};
