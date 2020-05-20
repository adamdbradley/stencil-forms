import { checkValidity } from './validation';
import { ctrls, ctrlDatas, debounces, Control } from './utils/state';
import { isFunction, isNumber } from './utils/helpers';
export const sharedOnInvalidHandler = (ev) => {
    ev.preventDefault();
    const ctrlElm = ev.currentTarget;
    const ctrlState = ctrlElm[Control];
    // add a space at the end to ensure we trigger a re-render
    ctrlState.validationMessage = ctrlElm.validationMessage + ' ';
};
export const sharedOnValueChangeHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    if (isNumber(ctrlData.debounce)) {
        clearTimeout(debounces.get(ctrlElm));
    }
    if (ev.key === 'Enter' || isFunction(ctrlData.onEnterKey)) {
        checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
        ctrlData.onEnterKey(value, ctrlElm.validity, ev);
    }
    else if (ev.key === 'Escape') {
        checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
        ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
    }
    else if (isFunction(ctrlData.onValueChange)) {
        if (isNumber(ctrlData.debounce)) {
            debounces.set(ctrlElm, setTimeout(() => {
                const value = getValueFromControlElement(ctrlData, ctrlElm);
                checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
                ctrlData.onValueChange(value, ctrlElm.validity, ev);
            }, ctrlData.debounce));
        }
        else {
            checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
            ctrlData.onValueChange(value, ctrlElm.validity, ev);
        }
    }
};
const afterInputValidity = (ctrlData, ctrlElm, value, ev) => {
    ctrlData.onValueChange(value, ctrlElm.validity, ev);
};
export const sharedOnFocus = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    checkValidity(ctrlData, ctrlElm, ev, afterFocusValidity);
};
const afterFocusValidity = (opts, ctrlElm, value, ev) => {
    if (ev.type === 'focus') {
        if (isFunction(opts.onFocus)) {
            opts.onFocus(value, ctrlElm.validity, ev);
        }
    }
    else if (ev.type === 'blur') {
        if (isFunction(opts.onBlur)) {
            opts.onBlur(value, ctrlElm.validity, ev);
        }
    }
};
export const getValueFromControlElement = (ctrlData, ctrlElm) => {
    const value = ctrlElm[ctrlData.valuePropName];
    if (ctrlData.valuePropType === 'boolean') {
        return String(value) === 'true';
    }
    if (ctrlData.valuePropType === 'number') {
        return parseFloat(value);
    }
    return String(value);
};
