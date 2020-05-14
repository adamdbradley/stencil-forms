import { formCtrlMap, inputEvDebounceMap } from './utils/state';
import { checkValidity } from './validation';
import type { ControlElement, ReactiveFormControl } from './utils/types';
import { isNumber, isFunction, isPromise } from './utils/helpers';

export const sharedOnInvalidHandler = (_ev: Event) => {
  // const ctrlElm = ev.currentTarget as ControlElement;
};

export const sharedOnInputHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const formCtrl = formCtrlMap.get(ctrlElm);
  if (isNumber(formCtrl.debounceInput)) {
    clearTimeout(inputEvDebounceMap.get(ctrlElm));
  }

  const validityResults = checkValidity(formCtrl, ctrlElm, ev);
  if (isPromise(validityResults)) {
    validityResults.then((isValid) => afterInputValidity(ev, ctrlElm, formCtrl, isValid));
  } else {
    afterInputValidity(ev, ctrlElm, formCtrl, validityResults);
  }
};

const afterInputValidity = (
  ev: KeyboardEvent,
  ctrlElm: ControlElement,
  formCtrl: ReactiveFormControl,
  isValid: boolean,
) => {
  if (isValid) {
  }

  if (ev.key === 'Enter' || isFunction(formCtrl.onEnter)) {
    if (isValid) {
      formCtrl.onEnter(ctrlElm.value, ctrlElm.validity, ev);
    } else {
      ev.preventDefault();
      ev.stopPropagation();
    }
  } else if (ev.key === 'Escape' || isFunction(formCtrl.onEscape)) {
    formCtrl.onEscape(ctrlElm.value, ctrlElm.validity, ev);
  } else if (isFunction(formCtrl.onInput)) {
    if (isNumber(formCtrl.debounceInput)) {
      inputEvDebounceMap.set(
        ctrlElm,
        setTimeout(() => formCtrl.onInput(ctrlElm.value, ctrlElm.validity, ev), formCtrl.debounceInput),
      );
    } else {
      formCtrl.onInput(ctrlElm.value, ctrlElm.validity, ev);
    }
  }
};
