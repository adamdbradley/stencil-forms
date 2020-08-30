import type {
  ControlData,
  ControlElement,
  ControlState,
  ReactiveFormControl,
  ReactiveFormEvent,
  ReactiveValidateResult,
} from './types';
import { ctrlElms, ctrlStates, getControlState } from './state';
import { isFunction, isPromise, isString, setAttribute, showNativeReport } from './helpers';

export const checkValidity = (
  ctrlData: ControlData,
  ctrlState: ControlState,
  ctrlElm: ControlElement,
  event: ReactiveFormEvent,
  cb: ((ctrlData: ControlData, event: ReactiveFormEvent) => void) | null,
) => {
  if (ctrlElm) {
    if (ctrlElm.validity && event.value !== ctrlState.l) {
      // need to do a new validation
      const callbackId = ++ctrlState.c;
      ctrlState.l = event.value;

      if (ctrlElm.setCustomValidity) {
        ctrlElm.setCustomValidity((ctrlState.e = ''));
      }

      if (!ctrlElm.validity.valid) {
        // native browser constraint
        ctrlState.e = ctrlElm.validationMessage;
      } else if (isFunction(ctrlData.validate)) {
        // has custom validate fn and the native browser constraints are valid
        const results = ctrlData.validate(event);
        if (isPromise(results)) {
          // results return a promise, let's wait on those
          ctrlState.m = isString(ctrlData.activelyValidatingMessage)
            ? ctrlData.activelyValidatingMessage
            : isFunction(ctrlData.activelyValidatingMessage)
            ? ctrlData.activelyValidatingMessage(event)
            : `Validating...`;

          if (ctrlElm.setCustomValidity) {
            ctrlElm.setCustomValidity(ctrlState.m);
          }
          results
            .then((promiseResults) => checkValidateResults(promiseResults, ctrlData, ctrlElm, event, callbackId, cb))
            .catch((err) => checkValidateResults(err, ctrlData, ctrlElm, event, callbackId, cb));
        } else {
          // results were not a promise
          checkValidateResults(results, ctrlData, ctrlElm, event, callbackId, cb);
        }
      } else {
        // no validate fn
        checkValidateResults('', ctrlData, ctrlElm, event, callbackId, cb);
      }
    } else if (isFunction(cb)) {
      // already validated this same value or element doesn't have validity
      cb(ctrlData, event);
    }
  }
};

const checkValidateResults = (
  results: ReactiveValidateResult,
  ctrlData: ControlData,
  ctrlElm: ControlElement,
  event: ReactiveFormEvent,
  callbackId: number,
  cb: ((ctrlData: ControlData, event: ReactiveFormEvent) => void | Promise<void>) | null,
) => {
  if (ctrlElm) {
    const ctrlState = ctrlStates.get(ctrlElm);
    if (ctrlState && (ctrlState.c === callbackId || (!ctrlElm.validity.valid && !ctrlElm.validity.customError))) {
      const msg = isString(results) ? results.trim() : '';
      if (ctrlElm.setCustomValidity) {
        ctrlElm.setCustomValidity(msg);
      }
      ctrlState.e = ctrlElm.validationMessage;
      ctrlState.m = '';

      if (!ctrlElm.validity.valid && showNativeReport(ctrlElm) && ctrlElm.reportValidity) {
        ctrlElm.reportValidity();
      }
    }
    if (isFunction(cb)) {
      cb(ctrlData, event);
    }
  }
};

export const catchError = (ctrlState: ControlState, event: ReactiveFormEvent, err: any) => {
  if (event.ctrl!.setCustomValidity!) {
    event.ctrl!.setCustomValidity((ctrlState.e = String(err.message || err)));
  }
  ctrlState.m = '';
};

/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns the message provided by the browser and
 * the custom validation method will not be called. If the value does
 * pass constraint validation then the custom `validation()` method
 * will be called and returns the message. If the value passes both the
 * constraint validation and custom valdation, then this method returns
 * and empty string.
 */
export const validationMessage = (ctrl: ReactiveFormControl) => {
  const ctrlElm = ctrlElms.get(ctrl);
  const ctrlState = getControlState(ctrl);

  setAttribute(ctrlElm, 'formnovalidate');

  if (ctrlState && (ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e;
  }
  return '';
};

/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return the message provided in `validatingMessage`.
 * All other times this method will return an empty string.
 */
export const activelyValidatingMessage = (ctrl: ReactiveFormControl) => {
  const ctrlState = getControlState(ctrl);
  if (ctrlState) {
    return ctrlState.m;
  }
  return '';
};

/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return `true` if the validation method is still pending.
 * All other times this method will return `false`.
 */
export const isActivelyValidating = (ctrl: ReactiveFormControl) => activelyValidatingMessage(ctrl) !== '';

/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `false` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `false`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `true`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
export const isValid = (ctrl: ReactiveFormControl) => {
  const ctrlState = getControlState(ctrl);
  if ((ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e === '';
  }
  return null;
};

/**
 * If the value has changed or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `true` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `true`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `false`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
export const isInvalid = (ctrl: ReactiveFormControl) => {
  const ctrlState = getControlState(ctrl);
  if ((ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e !== '';
  }
  return null;
};

/**
 * When the user changes the value of the form control element, the
 * control is "dirty" and this method returns `true`. If control's
 * initial value has not changed then this method returns `false`.
 */
export const isDirty = (ctrl: ReactiveFormControl) => !!getControlState(ctrl).d;

/**
 * When the user blurs the form control element, the control is
 * marked as "touched" and this method returns `true`. If the
 * control has not had a blur event then this method will return
 * `false`.
 */
export const isTouched = (ctrl: ReactiveFormControl) => !!getControlState(ctrl).t;

export const submitValidity = (message: string | undefined) => ({
  ref(btn: HTMLInputElement | HTMLButtonElement | undefined) {
    if (btn && btn.setCustomValidity) {
      btn.setCustomValidity(message ?? '');
    }
  },
});
