import { ctrlMap, ctrlOptsMap, inputEvDebounceMap } from './utils/state';
import { checkValidity } from './validation';
import type { ControlElement, ReactiveFormControlOptions } from './utils/types';
import { isNumber, isFunction, isPromise } from './utils/helpers';

export const sharedOnInvalidHandler = (_ev: Event) => {
  // const ctrlElm = ev.currentTarget as ControlElement;
};

export const sharedOnInputHandler = (ev: KeyboardEvent) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrlMap.get(ctrlElm);
  const opts = ctrlOptsMap.get(ctrl);

  if (isNumber(opts.debounce)) {
    clearTimeout(inputEvDebounceMap.get(ctrlElm));
  }

  const validityResults = checkValidity(opts, ctrlElm, ev);
  if (isPromise(validityResults)) {
    validityResults.then((isValid) => afterInputValidity(ev, ctrlElm, opts, isValid));
  } else {
    afterInputValidity(ev, ctrlElm, opts, validityResults);
  }
};

const afterInputValidity = (
  ev: KeyboardEvent,
  ctrlElm: ControlElement,
  opts: ReactiveFormControlOptions,
  isValid: boolean,
) => {
  if (ev.key === 'Enter' || isFunction(opts.onEnterKey)) {
    if (isValid) {
      opts.onEnterKey(ctrlElm.value, ctrlElm.validity, ev);
    } else {
      ev.preventDefault();
      ev.stopPropagation();
    }
  } else if (ev.key === 'Escape' || isFunction(opts.onEscapeKey)) {
    opts.onEscapeKey(ctrlElm.value, ctrlElm.validity, ev);
  } else if (isFunction(opts.onValueChange)) {
    if (isNumber(opts.debounce)) {
      inputEvDebounceMap.set(
        ctrlElm,
        setTimeout(() => opts.onValueChange(ctrlElm.value, ctrlElm.validity, ev), opts.debounce),
      );
    } else {
      opts.onValueChange(ctrlElm.value, ctrlElm.validity, ev);
    }
  }
};
