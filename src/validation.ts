import { ControlElement, ReactiveFormControl, ReactiveFormValidateResults, ControlData } from './types';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  value: any,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
): any => {
  if (ctrlElm && ctrlElm.parentNode && isFunction(ctrlElm.checkValidity)) {
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
  results: ReactiveFormValidateResults,
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  value: any,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
) => {
  ctrlElm.setCustomValidity(isString(results) ? results : '');
  cb(ctrlData, ctrlElm, value, ev);
};

export const validationMessage = (_ctrl: ReactiveFormControl) => {
  // const ctrlElm = ctrlElmMap.get(formCtrl);
};
