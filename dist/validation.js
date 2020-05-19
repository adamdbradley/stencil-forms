import { getValueFromControlElement } from './handlers';
import { isFunction, isPromise, isString } from './utils/helpers';
export const checkValidity = (ctrlData, ctrlElm, ev, cb) => {
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
    ctrlElm.setCustomValidity(isString(results) ? results : '');
    ctrlData.isValidating = false;
    if (!ctrlElm.validity.valid) {
        const showNativeReport = !ctrlElm.hasAttribute('formNoValidate') && !(ctrlElm === null || ctrlElm === void 0 ? void 0 : ctrlElm.form.hasAttribute('novalidate'));
        if (showNativeReport) {
            ctrlElm.reportValidity();
        }
    }
    cb(ctrlData, ctrlElm, value, ev);
};
export const isValidating = (_ctrl) => {
    // TODO!
    return false;
};
export const isValid = (_ctrl) => {
    // TODO!
    return false;
};
export const isInvalid = (_ctrl) => {
    // TODO!
    return false;
};
export const validationMessage = (_ctrl) => {
    // TODO!
};
