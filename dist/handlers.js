import { checkValidity } from './validation';
import { ctrlMap, ctrlOptsMap, inputEvDebounceMap as debounceMap } from './utils/state';
import { isBooleanInput, isFunction, isNumber } from './utils/helpers';
export const sharedOnInvalidHandler = (_ev) => {
    // const ctrlElm = ev.currentTarget as ControlElement;
};
export const sharedOnValueChangeHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrlMap.get(ctrlElm);
    const opts = ctrlOptsMap.get(ctrl);
    const value = isBooleanInput(ctrlElm) ? ctrlElm.checked : ctrlElm.value;
    if (isNumber(opts.debounce)) {
        clearTimeout(debounceMap.get(ctrlElm));
    }
    checkValidity(opts, ctrlElm, value, ev, afterInputValidity);
};
const afterInputValidity = (opts, ctrlElm, value, ev) => {
    if (ev.key === 'Enter' || isFunction(opts.onEnterKey)) {
        opts.onEnterKey(value, ctrlElm.validity, ev);
    }
    else if (ev.key === 'Escape' || isFunction(opts.onEscapeKey)) {
        opts.onEscapeKey(value, ctrlElm.validity, ev);
    }
    else if (isFunction(opts.onValueChange)) {
        if (isNumber(opts.debounce)) {
            debounceMap.set(ctrlElm, setTimeout(() => opts.onValueChange(value, ctrlElm.validity, ev), opts.debounce));
        }
        else {
            opts.onValueChange(value, ctrlElm.validity, ev);
        }
    }
};
