import { checkValidity } from './validation';
import { ControlElement, ReactiveFormControlOptions, ControlData } from './types';
import { ctrlMap, ctrlDataMap, debounceMap } from './utils/state';
import { isFunction, isNumber } from './utils/helpers';

export const sharedOnInvalidHandler = (_ev: Event) => {
  // const ctrlElm = ev.currentTarget as ControlElement;
};

export const sharedOnValueChangeHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrlMap.get(ctrlElm);
  const ctrlData = ctrlDataMap.get(ctrl);
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  if (isNumber(ctrlData.debounce)) {
    clearTimeout(debounceMap.get(ctrlElm));
  }

  checkValidity(ctrlData, ctrlElm, value, ev, afterInputValidity);
};

const afterInputValidity = (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: KeyboardEvent) => {
  if (ev.key === 'Enter' || isFunction(ctrlData.onEnterKey)) {
    ctrlData.onEnterKey(value, ctrlElm.validity, ev);
  } else if (ev.key === 'Escape' || isFunction(ctrlData.onEscapeKey)) {
    ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
  } else if (isFunction(ctrlData.onValueChange)) {
    if (isNumber(ctrlData.debounce)) {
      debounceMap.set(
        ctrlElm,
        setTimeout(() => ctrlData.onValueChange(value, ctrlElm.validity, ev), ctrlData.debounce),
      );
    } else {
      ctrlData.onValueChange(value, ctrlElm.validity, ev);
    }
  }
};

export const sharedOnFocus = (ev: FocusEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrlMap.get(ctrlElm);
  const ctrlData = ctrlDataMap.get(ctrl);
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  checkValidity(ctrlData, ctrlElm, value, ev, afterFocusValidity);
};

const afterFocusValidity = (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: FocusEvent) => {
  if (ev.type === 'focus') {
    if (isFunction(opts.onFocus)) {
      opts.onFocus(value, ctrlElm.validity, ev);
    }
  } else if (ev.type === 'blur') {
    if (isFunction(opts.onBlur)) {
      opts.onBlur(value, ctrlElm.validity, ev);
    }
  }
};

const getValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  const value: any = ctrlElm[ctrlData.valuePropName];
  if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  }
  if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  }
  return String(value);
};
