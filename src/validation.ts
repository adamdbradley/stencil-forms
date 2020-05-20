import { ControlData, ControlElement, ReactiveFormControl, ReactiveValidateResult, ControlState } from './types';
import { Control, getControlState, ctrlElms } from './utils/state';
import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString, setAttribute } from './utils/helpers';

export const checkValidity = (
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  ev: Event,
  cb: (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => void,
): any => {
  if (ctrlElm && ctrlElm.validity) {
    const ctrlState: ControlState = ctrlElm[Control];
    const value = getValueFromControlElement(ctrlData, ctrlElm);

    ctrlElm.setCustomValidity('');
    ctrlState.validationMessage = '';

    if (!ctrlElm.validity.valid) {
      // native browser constraint
      ctrlState.validationMessage = ctrlElm.validationMessage;
    } else if (isFunction(ctrlData.validate)) {
      // has custom validate fn and the native browser constraints are valid
      const results = ctrlData.validate(value, ev);
      if (isPromise(results)) {
        // results return a promise, let's wait on those
        const validatingMsg = isString(ctrlData.validatingMessage)
          ? ctrlData.validatingMessage
          : isFunction(ctrlData.validatingMessage)
          ? ctrlData.validatingMessage(value, ev)
          : `Validating...`;

        ctrlState.validatingMessage = validatingMsg;

        ctrlElm.setCustomValidity(validatingMsg);
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
  const ctrlState = ctrlElm[Control];
  const msg = isString(results) ? results.trim() : '';

  ctrlElm.setCustomValidity(msg);
  ctrlState.validationMessage = msg;

  if (!ctrlElm.validity.valid) {
    const showNativeReport = !ctrlElm.hasAttribute('formnovalidate') && !ctrlElm?.form.hasAttribute('novalidate');
    if (showNativeReport) {
      ctrlElm.reportValidity();
    }
  }

  cb && cb(ctrlData, ctrlElm, value, ev);
};

export const validationMessage = (ctrl: ReactiveFormControl) => {
  const ctrlElm = ctrlElms.get(ctrl);
  const ctrlState = getControlState(ctrl);

  if (ctrlElm) {
    setAttribute(ctrlElm, 'formnovalidate');
  }

  if (ctrlState) {
    return ctrlState.validationMessage;
  }
  return '';
};

export const activeValidatingMessage = (ctrl: ReactiveFormControl) => {
  const ctrlState = getControlState(ctrl);
  if (ctrlState) {
    return ctrlState.validatingMessage;
  }
  return '';
};

export const isActivelyValidating = (ctrl: ReactiveFormControl) => activeValidatingMessage(ctrl) !== '';

export const isValid = (ctrl: ReactiveFormControl) => validationMessage(ctrl) === '';

export const isInvalid = (ctrl: ReactiveFormControl) => validationMessage(ctrl) !== '';
