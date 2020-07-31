import { checkValidity } from './validation';
import type { ControlElement, ControlData, ControlState } from './types';
import { Control, ctrls, ctrlDatas, getControlState, inputDebounces } from './state';
import { getValueFromControlElement, setValueFromControlElement } from './value';
import { isFunction, isNumber, showNativeReport } from './helpers';

export const sharedEventHandler = (ev: Event) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;

  if (ctrl && ctrlData) {
    const ctrlState = getControlState(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    const validity = ctrlElm.validity;
    const eventType = ev.type;
    const key = (ev as KeyboardEvent).key;

    if (eventType === 'blur') {
      // "blur" event
      ctrlState.v = value;
      ctrlState.t = true;

      if (isFunction(ctrlData.onBlur)) {
        ctrlData.onBlur(value, validity, ev as FocusEvent);
      }
      if (isFunction(ctrlData.onCommit)) {
        // onCommit on blur event and Enter key event
        ctrlData.onCommit!(value, ev as FocusEvent);
      }
    } else if (eventType === 'focus') {
      // "focus" event
      ctrlState.v = value;

      if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
        // onTouch should only fire on the first focus
        ctrlData.onTouch(value, validity, ev as FocusEvent);
      }
      if (isFunction(ctrlData.onFocus)) {
        ctrlData.onFocus(value, validity, ev as FocusEvent);
      }
    } else if (eventType === 'invalid') {
      // "invalid" event
      if (!showNativeReport(ctrlElm)) {
        ev.preventDefault();
      }

      // add a space at the end to ensure we trigger a re-render
      ctrlState.e = ctrlElm.validationMessage + ' ';

      // a control is automatically "dirty" if it has been invalid at least once.
      ctrlState.d = true;
    } else {
      // "input" or "change" or keyboard events
      ctrlState.d = true;

      if (key === 'Escape' && ctrlData.resetOnEscape !== false) {
        setValueFromControlElement(ctrlData, ctrlElm, ctrlState.v);
        if (isFunction(ctrlData.onValueChange)) {
          ctrlData.onValueChange(ctrlState.v, validity, ev);
        }
      }

      if (key !== 'Enter' && key !== 'Escape' && isNumber(ctrlData.debounce)) {
        clearTimeout(inputDebounces.get(ctrlElm));
        inputDebounces.set(
          ctrlElm,
          setTimeout(() => checkValidity(ctrlData, ctrlElm, ev, setValueChange), ctrlData.debounce),
        );
      } else {
        checkValidity(ctrlData, ctrlElm, ev, setValueChange);
      }
    }
  }
};

const setValueChange = (ctrlData: ControlData, ctrlElm: ControlElement, value: any, ev: Event) => {
  if (ctrlData && ctrlElm) {
    const eventType = ev.type;
    const key = (ev as KeyboardEvent).key;
    const validity = ctrlElm.validity;
    const ctrlState: ControlState = (ctrlElm as any)[Control];
    ctrlState.d = true;

    if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
      ctrlData.onKeyDown(key, value, ev as KeyboardEvent);
    } else if (eventType === 'keyup') {
      if (isFunction(ctrlData.onKeyUp)) {
        ctrlData.onKeyUp!(key, value, ev as KeyboardEvent);
      }

      if (key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
        ctrlData.onEscapeKey!(value, ctrlState.v, ev as KeyboardEvent);
      } else if (key === 'Enter') {
        ctrlState.v = value;
        if (isFunction(ctrlData.onEnterKey)) {
          ctrlData.onEnterKey!(value, ev as KeyboardEvent);
        }
        if (isFunction(ctrlData.onCommit)) {
          ctrlData.onCommit!(value, ev as KeyboardEvent);
        }
      }
    } else if (isFunction(ctrlData.onValueChange)) {
      ctrlData.onValueChange!(value, validity, ev);
    }
  }
};
