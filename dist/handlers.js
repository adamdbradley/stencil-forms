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
    if (isFunction(ctrlData.onValueChange)) {
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
export const sharedOnKeyDownHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    if (isNumber(ctrlData.debounce)) {
        clearTimeout(inputDebounces.get(ctrlElm));
        inputDebounces.set(ctrlElm, setTimeout(() => {
            ctrlData.onKeyDown(ev.key, value, ev);
        }, ctrlData.debounce));
    }
    else {
        ctrlData.onKeyDown(ev.key, value, ev);
    }
};
export const sharedOnKeyUpHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    if (isNumber(ctrlData.debounce)) {
        clearTimeout(inputDebounces.get(ctrlElm));
        inputDebounces.set(ctrlElm, setTimeout(() => {
            ctrlData.onKeyUp(ev.key, value, ev);
        }, ctrlData.debounce));
    }
    else {
        ctrlData.onKeyUp(ev.key, value, ev);
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
        const validity = ctrlElm.validity;
        if (ev.type === 'blur') {
            ctrlState.t = true;
            if (isFunction(ctrlData.onBlur)) {
                ctrlData.onBlur(value, validity, ev);
            }
        }
        else {
            // focus
            if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
                // onTouch should only fire on the first focus
                ctrlData.onTouch(value, validity, ev);
            }
            if (isFunction(ctrlData.onFocus)) {
                ctrlData.onFocus(value, validity, ev);
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
