import type { ControlElement, ReactiveFormControl, ReactiveFormValidateResults } from './utils/types';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (formCtrl: ReactiveFormControl, ctrlElm: ControlElement, ev: Event) => {
  if (ctrlElm && isFunction(ctrlElm.checkValidity) && isFunction(formCtrl.validate)) {
    const validateResults = formCtrl.validate(ctrlElm.value, ev);
    if (isPromise(validateResults)) {
      return validateResults.then(checkValidateResults);
    }
    return checkValidateResults(validateResults);
  }
  return true;
};

const checkValidateResults = (validateResults: ReactiveFormValidateResults) => {
  if (validateResults != null) {
    if (isString(validateResults)) {
      // if (validateMsg && validateMsg !== '') {
      //   ctrlElm.setCustomValidity(validateMsg);
      // } else {
      //   ctrlElm.setCustomValidity('');
      // }
      // ctrlElm.validity.valid;
      // if (ctrlElm.checkValidity()) {
      // } else {
      //   return false;
      // }
    }
  }
  return true;
};

export const validationMessageFor = (_ctrl: ReactiveFormControl) => {
  // const ctrlElm = ctrlElmMap.get(formCtrl);
};
