import { checkValidity } from './validation';
import { ControlElement, ReactiveFormControlOptions, ControlData, ControlState } from './types';
import { Control, ctrls, ctrlDatas, inputDebounces } from './state';
import { isFunction, isNumber, showNativeReport } from './helpers';

export const sharedOnInvalidHandler = (ev: Event) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrlState: ControlState = (ctrlElm as any)[Control];

  if (!showNativeReport(ctrlElm)) {
    ev.preventDefault();
  }

  // add a space at the end to ensure we trigger a re-render
  ctrlState.e = ctrlElm.validationMessage + ' ';
};

export const sharedOnValueChangeHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;
  const value = getValueFromControlElement(ctrlData, ctrlElm);

  if (isNumber(ctrlData.debounce)) {
    clearTimeout(inputDebounces.get(ctrlElm));
  }

  if (ev.key === 'Enter' && isFunction(ctrlData.onEnterKey)) {
    checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
    ctrlData.onEnterKey(value, ctrlElm.validity, ev);
  } else if (ev.key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
    checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
    ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
  } else if (isFunction(ctrlData.onValueChange)) {
    if (isNumber(ctrlData.debounce)) {
      inputDebounces.set(
        ctrlElm,
        setTimeout(() => {
          const value = getValueFromControlElement(ctrlData, ctrlElm);
          checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
          ctrlData.onValueChange!(value, ctrlElm.validity, ev);
        }, ctrlData.debounce),
      );
    } else {
      checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
      ctrlData.onValueChange(value, ctrlElm.validity, ev);
    }
  }
};

const afterInputValidity = (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: any) => {
  if (ctrlData && ctrlElm) {
    ctrlData.onValueChange!(value, ctrlElm.validity, ev);
  }
};

export const sharedOnFocus = (ev: FocusEvent) => {
  if (ev) {
    const ctrlElm = ev.currentTarget as ControlElement;
    const ctrl = ctrls.get(ctrlElm)!;
    const ctrlData = ctrlDatas.get(ctrl)!;

    if (ctrlData && ev.type === 'blur') {
      checkValidity(ctrlData, ctrlElm, ev, afterFocusValidity);
    }
  }
};

const afterFocusValidity = (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: any) => {
  if (ev) {
    if (ev.type === 'blur') {
      if (isFunction(opts.onBlur)) {
        opts.onBlur(value, ctrlElm.validity, ev);
      }
    } else {
      if (isFunction(opts.onFocus)) {
        opts.onFocus(value, ctrlElm.validity, ev);
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
