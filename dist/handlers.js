import { checkValidity, catchError } from './validation';
import { Control, ctrls, ctrlDatas, getControlState, inputDebounces } from './state';
import { getValueFromControlElement, setValueFromControlElement } from './value';
import { isFunction, isNumber, showNativeReport } from './helpers';
export const sharedEventHandler = (ev) => {
    const elm = ev.currentTarget;
    const ctrl = ctrls.get(elm);
    const ctrlData = ctrlDatas.get(ctrl);
    if (ctrl && ctrlData) {
        const ctrlState = getControlState(ctrl);
        const value = getValueFromControlElement(ctrlData, elm);
        const validity = elm.validity;
        const eventType = ev.type;
        const key = ev.key;
        const rtns = [];
        try {
            if (eventType === 'blur') {
                // "blur" event
                ctrlState.v = value;
                ctrlState.t = true;
                if (isFunction(ctrlData.onBlur)) {
                    rtns.push(ctrlData.onBlur({ value, validity, ev: ev, elm }));
                }
                if (isFunction(ctrlData.onCommit)) {
                    // onCommit on blur event and Enter key event
                    rtns.push(ctrlData.onCommit({ value, validity, ev: ev, elm }));
                }
            }
            else if (eventType === 'focus') {
                // "focus" event
                ctrlState.v = value;
                if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
                    // onTouch should only fire on the first focus
                    rtns.push(ctrlData.onTouch({ value, validity, ev: ev, elm }));
                }
                if (isFunction(ctrlData.onFocus)) {
                    rtns.push(ctrlData.onFocus({ value, validity, ev: ev, elm }));
                }
            }
            else if (eventType === 'invalid') {
                // "invalid" event
                if (!showNativeReport(elm)) {
                    ev.preventDefault();
                }
                // add a space at the end to ensure we trigger a re-render
                ctrlState.e = elm.validationMessage + ' ';
                // a control is automatically "dirty" if it has been invalid at least once.
                ctrlState.d = true;
            }
            else {
                // "input" or "change" or keyboard events
                ctrlState.d = true;
                if (key === 'Escape' && ctrlData.resetOnEscape !== false) {
                    setValueFromControlElement(ctrlData, elm, ctrlState.v);
                    if (isFunction(ctrlData.onValueChange)) {
                        rtns.push(ctrlData.onValueChange({ value: ctrlState.v, validity, ev, elm }));
                    }
                }
                if (key !== 'Enter' && key !== 'Escape' && isNumber(ctrlData.debounce)) {
                    clearTimeout(inputDebounces.get(elm));
                    inputDebounces.set(elm, setTimeout(() => checkValidity(ctrlData, elm, ev, setValueChange), ctrlData.debounce));
                }
                else {
                    checkValidity(ctrlData, elm, ev, setValueChange);
                }
            }
            Promise.all(rtns).catch((err) => catchError(elm, ctrlState, err));
        }
        catch (e) {
            catchError(elm, ctrlState, e);
        }
    }
};
const setValueChange = (ctrlData, elm, value, ev) => {
    if (ctrlData && elm) {
        const eventType = ev.type;
        const key = ev.key;
        const validity = elm.validity;
        const ctrlState = elm[Control];
        const rtns = [];
        try {
            ctrlState.d = true;
            if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
                rtns.push(ctrlData.onKeyDown({ key, value, validity, ev: ev, elm }));
            }
            else if (eventType === 'keyup') {
                if (isFunction(ctrlData.onKeyUp)) {
                    rtns.push(ctrlData.onKeyUp({ key, value, validity, ev: ev, elm }));
                }
                if (key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
                    rtns.push(ctrlData.onEscapeKey({ key, value, validity, ev: ev, elm }));
                }
                else if (key === 'Enter') {
                    ctrlState.v = value;
                    if (isFunction(ctrlData.onEnterKey)) {
                        rtns.push(ctrlData.onEnterKey({ key, value, validity, ev: ev, elm }));
                    }
                    if (isFunction(ctrlData.onCommit)) {
                        rtns.push(ctrlData.onCommit({ value, validity, ev: ev, elm }));
                    }
                }
            }
            else if (isFunction(ctrlData.onValueChange)) {
                rtns.push(ctrlData.onValueChange({ value, validity, ev, elm }));
            }
            Promise.all(rtns).catch((err) => catchError(elm, ctrlState, err));
        }
        catch (e) {
            catchError(elm, ctrlState, e);
        }
    }
};
