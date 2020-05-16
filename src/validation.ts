import { ControlElement, ReactiveFormControl, ReactiveFormControlOptions, ReactiveFormValidateResults } from './types';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (
  opts: ReactiveFormControlOptions,
  ctrlElm: ControlElement,
  value: any,
  ev: Event,
  cb: (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: Event) => void,
): any => {
  if (ctrlElm && ctrlElm.parentNode && isFunction(ctrlElm.checkValidity)) {
    if (isFunction(opts.validate)) {
      // has custom validate fn
      const results = opts.validate(value, ev);
      if (isPromise(results)) {
        // results return a promise, let's wait on those
        results.then((promiseResults) => checkValidateResults(promiseResults, opts, ctrlElm, value, ev, cb));
      } else {
        // results were not a promise
        checkValidateResults(results, opts, ctrlElm, value, ev, cb);
      }
    } else {
      // no validate fn
      checkValidateResults('', opts, ctrlElm, value, ev, cb);
    }
  }
};

const checkValidateResults = (
  results: ReactiveFormValidateResults,
  opts: ReactiveFormControlOptions,
  ctrlElm: ControlElement,
  value: any,
  ev: Event,
  cb: (opts: ReactiveFormControlOptions, ctrlElm: ControlElement, value: any, ev: Event) => void,
) => {
  ctrlElm.setCustomValidity(isString(results) ? results : '');
  cb(opts, ctrlElm, value, ev);
};

export const validationMessage = (_ctrl: ReactiveFormControl) => {
  // const ctrlElm = ctrlElmMap.get(formCtrl);
};
