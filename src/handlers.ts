import { checkValidity } from './validation';
import { ControlElement, ReactiveFormControlOptions, ControlData } from './types';
import { ctrls, ctrlDatas, debounces } from './utils/state';
import { isFunction, isNumber } from './utils/helpers';

export const sharedOnInvalidHandler = (_ev: Event) => {
  console.log('onInvalid', _ev);
};

export const sharedOnValueChangeHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm);
  const ctrlData = ctrlDatas.get(ctrl);
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  if (isNumber(ctrlData.debounce)) {
    clearTimeout(debounces.get(ctrlElm));
  }

  if (ev.key === 'Enter' || isFunction(ctrlData.onEnterKey)) {
    checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
    ctrlData.onEnterKey(value, ctrlElm.validity, ev);
  } else if (ev.key === 'Escape') {
    checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
    ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
  } else if (isFunction(ctrlData.onValueChange)) {
    if (isNumber(ctrlData.debounce)) {
      debounces.set(
        ctrlElm,
        setTimeout(() => {
          const value = getValueFromControlElement(ctrlData, ctrlElm);
          checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
          ctrlData.onValueChange(value, ctrlElm.validity, ev);
        }, ctrlData.debounce),
      );
    } else {
      checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
      ctrlData.onValueChange(value, ctrlElm.validity, ev);
    }
  }
};

const afterInputValidity = (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: KeyboardEvent) => {
  ctrlData.onValueChange(value, ctrlElm.validity, ev);
};

export const sharedOnFocus = (ev: FocusEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm);
  const ctrlData = ctrlDatas.get(ctrl);
  checkValidity(ctrlData, ctrlElm, ev, afterFocusValidity);
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

export const getValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  const value: any = ctrlElm[ctrlData.valuePropName];
  if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  }
  if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  }
  return String(value);
};
