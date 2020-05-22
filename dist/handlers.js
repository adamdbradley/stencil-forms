import { checkValidity } from './validation';
import { Control, ctrls, ctrlDatas, inputDebounces } from './state';
import { isFunction, isNumber, showNativeReport } from './helpers';
export const sharedOnInvalidHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrlState = ctrlElm[Control];
    if (!showNativeReport(ctrlElm)) {
        ev.preventDefault();
    }
    // add a space at the end to ensure we trigger a re-render
    ctrlState.e = ctrlElm.validationMessage + ' ';
    // a control is automatically "dirty" if it has been invalid at least once.
    ctrlState.d = true;
};
export const sharedOnValueChangeHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    if (isNumber(ctrlData.debounce)) {
        clearTimeout(inputDebounces.get(ctrlElm));
    }
    if (ev.key === 'Enter' && isFunction(ctrlData.onEnterKey)) {
        checkValidity(ctrlData, ctrlElm, ev, setValueChange);
        ctrlData.onEnterKey(value, ctrlElm.validity, ev);
    }
    else if (ev.key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
        checkValidity(ctrlData, ctrlElm, ev, setValueChange);
        ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
    }
    else if (isFunction(ctrlData.onValueChange)) {
        if (isNumber(ctrlData.debounce)) {
            inputDebounces.set(ctrlElm, setTimeout(() => {
                const value = getValueFromControlElement(ctrlData, ctrlElm);
                checkValidity(ctrlData, ctrlElm, ev, setValueChange);
                ctrlData.onValueChange(value, ctrlElm.validity, ev);
            }, ctrlData.debounce));
        }
        else {
            checkValidity(ctrlData, ctrlElm, ev, setValueChange);
            setValueChange(ctrlData, ctrlElm, value, ev);
        }
    }
};
const setValueChange = (ctrlData, ctrlElm, value, ev) => {
    if (ctrlData && ctrlElm) {
        const ctrlState = ctrlElm[Control];
        ctrlState.d = true;
        ctrlData.onValueChange(value, ctrlElm.validity, ev);
    }
};
export const sharedOnFocus = (ev) => {
    const ctrlElm = ev === null || ev === void 0 ? void 0 : ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    if (ctrlData) {
        const ctrlState = ctrlElm[Control];
        const value = getValueFromControlElement(ctrlData, ctrlElm);
        if (ev.type === 'blur') {
            ctrlState.t = true;
            if (isFunction(ctrlData.onBlur)) {
                ctrlData.onBlur(value, ctrlElm.validity, ev);
            }
        }
        else {
            if (isFunction(ctrlData.onFocus)) {
                ctrlData.onFocus(value, ctrlElm.validity, ev);
            }
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
