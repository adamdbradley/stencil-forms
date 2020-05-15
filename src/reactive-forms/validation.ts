import type {
  ControlElement,
  ReactiveFormControl,
  ReactiveFormValidateResults,
  ReactiveFormControlOptions,
} from './utils/types';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, ev: Event) => {
  if (ctrlElm && isFunction(ctrlElm.checkValidity) && isFunction(opts.validate)) {
    const validateResults = opts.validate(ctrlElm.value, ev);
    if (isPromise(validateResults)) {
      return validateResults.then((validateResults) => checkValidateResults(validateResults, ctrlElm));
    }
    return checkValidateResults(validateResults, ctrlElm);
  }
  return true;
};

const checkValidateResults = (validateResults: ReactiveFormValidateResults, ctrlElm: ControlElement) => {
  if (isString(validateResults) && validateResults !== '') {
    ctrlElm.setCustomValidity('');
  }
  return true;
};

export const validationMessageFor = (_ctrl: ReactiveFormControl) => {
  // const ctrlElm = ctrlElmMap.get(formCtrl);
};
