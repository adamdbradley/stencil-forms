import { ctrlMap, ctrlOptsMap, inputEvDebounceMap } from './utils/state';
import { checkValidity } from './validation';
import type { ControlElement, ReactiveFormControlOptions } from './utils/types';
import { isNumber, isFunction, isBooleanInput } from './utils/helpers';

export const sharedOnInvalidHandler = (_ev: Event) => {
  // const ctrlElm = ev.currentTarget as ControlElement;
};

export const sharedOnValueChangeHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrlMap.get(ctrlElm);
  const opts = ctrlOptsMap.get(ctrl);
  const value = isBooleanInput(ctrlElm) ? ctrlElm.checked : ctrlElm.value;

  if (isNumber(opts.debounce)) {
    clearTimeout(inputEvDebounceMap.get(ctrlElm));
  }

  checkValidity(opts, ctrlElm, value, ev, afterInputValidity);
};

const afterInputValidity = (
  opts: ReactiveFormControlOptions,
  ctrlElm: ControlElement,
  value: any,
  ev: KeyboardEvent,
) => {
  if (ev.key === 'Enter' || isFunction(opts.onEnterKey)) {
    opts.onEnterKey(value, ctrlElm.validity, ev);
  } else if (ev.key === 'Escape' || isFunction(opts.onEscapeKey)) {
    opts.onEscapeKey(value, ctrlElm.validity, ev);
  } else if (isFunction(opts.onValueChange)) {
    if (isNumber(opts.debounce)) {
      inputEvDebounceMap.set(
        ctrlElm,
        setTimeout(() => opts.onValueChange(value, ctrlElm.validity, ev), opts.debounce),
      );
    } else {
      opts.onValueChange(value, ctrlElm.validity, ev);
    }
  }
};
