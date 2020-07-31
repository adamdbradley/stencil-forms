import { Control, getControlState, ctrlElms } from './state';
import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString, setAttribute, showNativeReport } from './helpers';
export const checkValidity = (ctrlData, ctrlElm, ev, cb) => {
    if (ctrlElm && ctrlElm.validity) {
        const ctrlState = ctrlElm[Control];
        const value = getValueFromControlElement(ctrlData, ctrlElm);
        const callbackId = ++ctrlState.c;
        ctrlElm.setCustomValidity((ctrlState.e = ''));
        if (!ctrlElm.validity.valid) {
            // native browser constraint
            ctrlState.e = ctrlElm.validationMessage;
        }
        else if (isFunction(ctrlData.validate)) {
            // has custom validate fn and the native browser constraints are valid
            const results = ctrlData.validate(value, ctrlElm.validity, ev);
            if (isPromise(results)) {
                // results return a promise, let's wait on those
                ctrlState.m = isString(ctrlData.activelyValidatingMessage)
                    ? ctrlData.activelyValidatingMessage
                    : isFunction(ctrlData.activelyValidatingMessage)
                        ? ctrlData.activelyValidatingMessage(value, ev)
                        : `Validating...`;
                ctrlElm.setCustomValidity(ctrlState.m);
                results.then((promiseResults) => checkValidateResults(promiseResults, ctrlData, ctrlElm, value, ev, callbackId, cb));
            }
            else {
                // results were not a promise
                checkValidateResults(results, ctrlData, ctrlElm, value, ev, callbackId, cb);
            }
        }
        else {
            // no validate fn
            checkValidateResults('', ctrlData, ctrlElm, value, ev, callbackId, cb);
        }
    }
};
const checkValidateResults = (results, ctrlData, ctrlElm, value, ev, callbackId, cb) => {
    const ctrlState = ctrlElm[Control];
    const msg = isString(results) ? results.trim() : '';
    if (ctrlState &&
        ctrlElm &&
        (ctrlState.c === callbackId || (!ctrlElm.validity.valid && !ctrlElm.validity.customError))) {
        ctrlElm.setCustomValidity(msg);
        ctrlState.e = ctrlElm.validationMessage;
        ctrlState.m = '';
        if (!ctrlElm.validity.valid && showNativeReport(ctrlElm)) {
            ctrlElm.reportValidity();
        }
        cb && cb(ctrlData, ctrlElm, value, ev);
    }
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
export const validationMessage = (ctrl) => {
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
export const activelyValidatingMessage = (ctrl) => {
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
export const isActivelyValidating = (ctrl) => activelyValidatingMessage(ctrl) !== '';
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
export const isValid = (ctrl) => {
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
export const isInvalid = (ctrl) => {
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
export const isDirty = (ctrl) => !!getControlState(ctrl).d;
/**
 * When the user blurs the form control element, the control is
 * marked as "touched" and this method returns `true`. If the
 * control has not had a blur event then this method will return
 * `false`.
 */
export const isTouched = (ctrl) => !!getControlState(ctrl).t;
export const submitValidity = (message) => {
    return {
        ref(btn) {
            btn.setCustomValidity(message !== null && message !== void 0 ? message : '');
        },
    };
};
