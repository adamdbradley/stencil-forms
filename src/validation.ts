import { ControlElement, ReactiveFormControl, ReactiveValidateResult, ControlData } from './types';
import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
): any => {
  if (ctrlElm && ctrlElm.parentNode && isFunction(ctrlElm.checkValidity)) {
    const value = getValueFromControlElement(ctrlData, ctrlElm);

    ctrlElm.setCustomValidity('');

    if (isFunction(ctrlData.validate)) {
      // has custom validate fn
      const results = ctrlData.validate(value, ev);
      if (isPromise(results)) {
        // results return a promise, let's wait on those
        results.then((promiseResults) => checkValidateResults(promiseResults, ctrlData, ctrlElm, value, ev, cb));
      } else {
        // results were not a promise
        checkValidateResults(results, ctrlData, ctrlElm, value, ev, cb);
      }
    } else {
      // no validate fn
      checkValidateResults('', ctrlData, ctrlElm, value, ev, cb);
    }
  }
};

const checkValidateResults = (
  results: ReactiveValidateResult,
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  value: any,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
) => {
  if (isString(results) && results.trim() !== '') {
    ctrlElm.setCustomValidity(results);
    ctrlElm.reportValidity();
  }

  // ctrlElm.checkValidity();
  cb(ctrlData, ctrlElm, value, ev);
};

export const validationMessage = (_ctrl: ReactiveFormControl) => {
  // const ctrlElm = ctrlElmMap.get(formCtrl);
};
