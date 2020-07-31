import { checkValidity } from './validation';
import type { ControlElement, ControlData, ControlState } from './types';
import { Control, ctrls, ctrlDatas, inputDebounces, getControlState } from './state';
import { isFunction, isNumber, showNativeReport } from './helpers';

export const sharedOnInvalidHandler = (ev: Event) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrlState: ControlState = (ctrlElm as any)[Control];

  if (!showNativeReport(ctrlElm)) {
    ev.preventDefault();
  }

  // add a space at the end to ensure we trigger a re-render
  ctrlState.e = ctrlElm.validationMessage + ' ';

  // a control is automatically "dirty" if it has been invalid at least once.
  ctrlState.d = true;
};

export const sharedOnValueChangeHandler = (ev: InputEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  if (isNumber(ctrlData.debounce)) {
    clearTimeout(inputDebounces.get(ctrlElm));
  }

  if (isFunction(ctrlData.onValueChange)) {
    if (isNumber(ctrlData.debounce)) {
      inputDebounces.set(
        ctrlElm,
        setTimeout(() => {
          const value = getValueFromControlElement(ctrlData, ctrlElm);
          checkValidity(ctrlData, ctrlElm, ev, setValueChange);
          ctrlData.onValueChange!(value, ctrlElm.validity, ev);
        }, ctrlData.debounce),
      );
    } else {
      checkValidity(ctrlData, ctrlElm, ev, setValueChange);
      setValueChange(ctrlData, ctrlElm, value, ev);
    }
  }
};

export const sharedOnKeyDownHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;
  const value = getValueFromControlElement(ctrlData, ctrlElm);
  if (isNumber(ctrlData.debounce)) {
    clearTimeout(inputDebounces.get(ctrlElm));
    inputDebounces.set(
      ctrlElm,
      setTimeout(() => {
        ctrlData.onKeyDown!(ev.key, value, ev);
      }, ctrlData.debounce),
    );
  } else {
    ctrlData.onKeyDown!(ev.key, value, ev);
  }
};

export const sharedOnKeyUpHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const key = ev.key;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;
  const ctrlState = getControlState(ctrl);
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  if (isNumber(ctrlData.debounce)) {
    clearTimeout(inputDebounces.get(ctrlElm));
    inputDebounces.set(
      ctrlElm,
      setTimeout(() => sharedOnKeyUp(ctrlElm, ctrlData, ctrlState, value, key, ev), ctrlData.debounce),
    );
  } else {
    sharedOnKeyUp(ctrlElm, ctrlData, ctrlState, value, key, ev);
  }
};

const sharedOnKeyUp = (
  ctrlElm: ControlElement,
  ctrlData: ControlData,
  ctrlState: ControlState,
  value: string | boolean | number,
  key: string,
  ev: KeyboardEvent,
) => {
  if (isFunction(ctrlData.onKeyUp)) {
    ctrlData.onKeyUp!(key, value, ev);
  }

  if (key === 'Escape') {
    if (ctrlData.resetOnEscape !== false) {
      ctrlElm.value = ctrlState.v;
      if (isFunction(ctrlData.onValueChange)) {
        ctrlData.onValueChange(ctrlState.v, ctrlElm.validity, ev);
      }
    }
    if (isFunction(ctrlData.onEscapeKey)) {
      ctrlData.onEscapeKey!(value, ctrlState.v, ev);
    }
  }

  if (key === 'Enter') {
    ctrlState.v = value;
    if (isFunction(ctrlData.onEnterKey)) {
      ctrlData.onEnterKey!(value, ev);
    }
    if (isFunction(ctrlData.onCommit)) {
      ctrlData.onCommit!(value, ev);
    }
  }
};

const setValueChange = (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: any) => {
  if (ctrlData && ctrlElm) {
    const ctrlState: ControlState = (ctrlElm as any)[Control];
    ctrlState.d = true;
    ctrlData.onValueChange!(value, ctrlElm.validity, ev);
  }
};

export const sharedOnFocus = (ev: FocusEvent) => {
  const ctrlElm = ev?.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;

  if (ctrlData) {
    const ctrlState: ControlState = (ctrlElm as any)[Control];
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    const validity = ctrlElm.validity;
    ctrlState.v = value;

    if (ev.type === 'blur') {
      ctrlState.t = true;
      if (isFunction(ctrlData.onBlur)) {
        ctrlData.onBlur(value, validity, ev);
      }
      if (isFunction(ctrlData.onCommit)) {
        ctrlData.onCommit!(value, ev);
      }
    } else {
      // focus
      if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
        // onTouch should only fire on the first focus
        ctrlData.onTouch(value, validity, ev);
      }
      if (isFunction(ctrlData.onFocus)) {
        ctrlData.onFocus(value, validity, ev);
      }
    }
  }
};

export const getValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  const value: any = (ctrlElm as any)[ctrlData.valuePropName!];
  if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  }
  if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  }
  return String(value);
};
