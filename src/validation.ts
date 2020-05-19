import { ControlElement, ReactiveFormControl, ReactiveValidateResult, ControlData } from './types';
import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString } from './utils/helpers';

export const checkValidity = (
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
): any => {
  if (ctrlElm && ctrlElm.parentNode && ctrlElm.validity) {
    ctrlElm.setCustomValidity('');
    ctrlData.isValidating = false;

    const value = getValueFromControlElement(ctrlData, ctrlElm);

    if (isFunction(ctrlData.validate) && ctrlElm.validity.valid) {
      // has custom validate fn and the native browser constraints are valid
      const results = ctrlData.validate(value, ev);
      if (isPromise(results)) {
        // results return a promise, let's wait on those
        ctrlData.isValidating = true;

        const validatingMsg = isString(ctrlData.validatingMessage)
          ? ctrlData.validatingMessage
          : isFunction(ctrlData.validatingMessage)
          ? ctrlData.validatingMessage(value, ev)
          : null;

        ctrlElm.setCustomValidity(isString(validatingMsg) ? validatingMsg : `Validating...`);
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
  ctrlElm.setCustomValidity(isString(results) ? results : '');
  ctrlData.isValidating = false;

  if (!ctrlElm.validity.valid) {
    const showNativeReport = !ctrlElm.hasAttribute('formNoValidate') && !ctrlElm?.form.hasAttribute('novalidate');
    if (showNativeReport) {
      ctrlElm.reportValidity();
    }
  }

  cb(ctrlData, ctrlElm, value, ev);
};

export const isValidating = (_ctrl: ReactiveFormControl) => {
  // TODO!
  return false;
};

export const isValid = (_ctrl: ReactiveFormControl) => {
  // TODO!
  return false;
};

export const isInvalid = (_ctrl: ReactiveFormControl) => {
  // TODO!
  return false;
};

export const validationMessage = (_ctrl: ReactiveFormControl) => {
  // TODO!
};
