import { isFunction, isPromise, isString } from './utils/helpers';
export const checkValidity = (opts, ctrlElm, value, ev, cb) => {
    if (ctrlElm && ctrlElm.parentNode && isFunction(ctrlElm.checkValidity)) {
        if (isFunction(opts.validate)) {
            // has custom validate fn
            const results = opts.validate(value, ev);
            if (isPromise(results)) {
                // results return a promise, let's wait on those
                results.then((promiseResults) => checkValidateResults(promiseResults, opts, ctrlElm, value, ev, cb));
            }
            else {
                // results were not a promise
                checkValidateResults(results, opts, ctrlElm, value, ev, cb);
            }
        }
        else {
            // no validate fn
            checkValidateResults('', opts, ctrlElm, value, ev, cb);
        }
    }
};
const checkValidateResults = (results, opts, ctrlElm, value, ev, cb) => {
    ctrlElm.setCustomValidity(isString(results) ? results : '');
    cb(opts, ctrlElm, value, ev);
};
export const validationMessage = (_ctrl) => {
    // const ctrlElm = ctrlElmMap.get(formCtrl);
};
