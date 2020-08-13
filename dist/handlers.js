import { checkValidity, catchError } from './validation';
import { Control, ctrls, ctrlDatas, getControlState, inputDebounces } from './state';
import { getValueFromControlElement, setValueFromControlElement } from './value';
import { isFunction, isNumber, showNativeReport } from './helpers';
export const sharedEventHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    if (ctrl && ctrlData) {
        const ctrlState = getControlState(ctrl);
        const type = ev.type;
        const key = ev.key;
        const rtns = [];
        const event = {
            value: getValueFromControlElement(ctrlData, ctrlElm),
            initialValue: ctrlState.i,
            validity: ctrlElm.validity,
            key,
            type,
            ev: ev,
            ctrl: ctrlElm,
        };
        try {
            if (type === 'blur') {
                // "blur" event
                ctrlState.t = true;
                if (isFunction(ctrlData.onBlur)) {
                    rtns.push(ctrlData.onBlur(event));
                }
            }
            else if (type === 'focus') {
                // "focus" event
                // reset "initialValue" state
                ctrlState.i = event.initialValue = event.value;
                if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
                    // onTouch should only fire on the first focus
                    rtns.push(ctrlData.onTouch(event));
                }
                if (isFunction(ctrlData.onFocus)) {
                    rtns.push(ctrlData.onFocus(event));
                }
            }
            else if (type === 'invalid') {
                // "invalid" event
                if (!showNativeReport(ctrlElm)) {
                    ev.preventDefault();
                }
                // add a space at the end to ensure we trigger a re-render
                ctrlState.e = ctrlElm.validationMessage + ' ';
                // a control is automatically "dirty" if it has been invalid at least once.
                ctrlState.d = true;
            }
            else {
                // "input" or "change" or keyboard events
                ctrlState.d = true;
                if (key === 'Escape' && ctrlData.resetOnEscape !== false) {
                    setValueFromControlElement(ctrlData, ctrlElm, ctrlState.i);
                    if (isFunction(ctrlData.onValueChange)) {
                        event.value = ctrlState.i;
                        rtns.push(ctrlData.onValueChange(event));
                    }
                }
                if (key !== 'Enter' && key !== 'Escape' && isNumber(ctrlData.debounce)) {
                    clearTimeout(inputDebounces.get(ctrlElm));
                    inputDebounces.set(ctrlElm, setTimeout(() => checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange), ctrlData.debounce));
                }
                else if (!(key === 'Enter' && ctrlElm.nodeName === 'TEXTAREA')) {
                    checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange);
                }
            }
            Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
        }
        catch (e) {
            catchError(ctrlState, event, e);
        }
    }
};
const setValueChange = (ctrlData, event) => {
    if (ctrlData && event && event.ctrl && event.ctrl.parentNode) {
        const ctrlState = event.ctrl[Control];
        const rtns = [];
        const eventType = event.type;
        try {
            ctrlState.d = true;
            if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
                rtns.push(ctrlData.onKeyDown(event));
            }
            else if (eventType === 'keyup') {
                if (isFunction(ctrlData.onKeyUp)) {
                    rtns.push(ctrlData.onKeyUp(event));
                }
                if (event.key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
                    rtns.push(ctrlData.onEscapeKey(event));
                }
                else if (event.key === 'Enter') {
                    ctrlState.i = eventType;
                    if (isFunction(ctrlData.onEnterKey)) {
                        rtns.push(ctrlData.onEnterKey(event));
                    }
                    if (isFunction(ctrlData.onCommit)) {
                        rtns.push(ctrlData.onCommit(event));
                    }
                }
            }
            else if (isFunction(ctrlData.onValueChange)) {
                rtns.push(ctrlData.onValueChange(event));
            }
            if (eventType === 'change' && isFunction(ctrlData.onCommit)) {
                // onCommit on blur event and Enter key event
                rtns.push(ctrlData.onCommit(event));
            }
            Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
        }
        catch (e) {
            catchError(ctrlState, event, e);
        }
    }
};
