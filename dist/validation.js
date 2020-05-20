import { Control, getControlState, ctrlElms } from './utils/state';
import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString, setAttribute } from './utils/helpers';
export const checkValidity = (ctrlData, ctrlElm, ev, cb) => {
    if (ctrlElm && ctrlElm.validity) {
        const ctrlState = ctrlElm[Control];
        const value = getValueFromControlElement(ctrlData, ctrlElm);
        ctrlElm.setCustomValidity('');
        ctrlState.validationMessage = '';
        if (!ctrlElm.validity.valid) {
            // native browser constraint
            ctrlState.validationMessage = ctrlElm.validationMessage;
        }
        else if (isFunction(ctrlData.validate)) {
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
            }
            else {
                // results were not a promise
                checkValidateResults(results, ctrlData, ctrlElm, value, ev, cb);
            }
        }
        else {
            // no validate fn
            checkValidateResults('', ctrlData, ctrlElm, value, ev, cb);
        }
    }
};
const checkValidateResults = (results, ctrlData, ctrlElm, value, ev, cb) => {
    const ctrlState = ctrlElm[Control];
    const msg = isString(results) ? results.trim() : '';
    ctrlElm.setCustomValidity(msg);
    ctrlState.validationMessage = msg;
    if (!ctrlElm.validity.valid) {
        const showNativeReport = !ctrlElm.hasAttribute('formnovalidate') && !(ctrlElm === null || ctrlElm === void 0 ? void 0 : ctrlElm.form.hasAttribute('novalidate'));
        if (showNativeReport) {
            ctrlElm.reportValidity();
        }
    }
    cb && cb(ctrlData, ctrlElm, value, ev);
};
export const validationMessage = (ctrl) => {
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
export const activeValidatingMessage = (ctrl) => {
    const ctrlState = getControlState(ctrl);
    if (ctrlState) {
        return ctrlState.validatingMessage;
    }
    return '';
};
export const isActivelyValidating = (ctrl) => activeValidatingMessage(ctrl) !== '';
export const isValid = (ctrl) => validationMessage(ctrl) === '';
export const isInvalid = (ctrl) => validationMessage(ctrl) !== '';
