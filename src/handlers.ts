import { checkValidity } from './validation';
import type { ControlElement, ControlData, ControlState } from './types';
import { Control, ctrls, ctrlDatas, getControlState, inputDebounces } from './state';
import { getValueFromControlElement, setValueFromControlElement } from './value';
import { isFunction, isNumber, showNativeReport } from './helpers';

export const sharedEventHandler = (ev: Event) => {
  const elm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(elm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;

  if (ctrl && ctrlData) {
    const ctrlState = getControlState(ctrl);
    const value = getValueFromControlElement(ctrlData, elm);
    const validity = elm.validity;
    const eventType = ev.type;
    const key = (ev as KeyboardEvent).key;

    try {
      if (eventType === 'blur') {
        // "blur" event
        ctrlState.v = value;
        ctrlState.t = true;

        if (isFunction(ctrlData.onBlur)) {
          ctrlData.onBlur({ value, validity, ev: ev as FocusEvent, elm });
        }
        if (isFunction(ctrlData.onCommit)) {
          // onCommit on blur event and Enter key event
          ctrlData.onCommit!({ value, validity, ev: ev as FocusEvent, elm });
        }
      } else if (eventType === 'focus') {
        // "focus" event
        ctrlState.v = value;

        if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
          // onTouch should only fire on the first focus
          ctrlData.onTouch({ value, validity, ev: ev as FocusEvent, elm });
        }
        if (isFunction(ctrlData.onFocus)) {
          ctrlData.onFocus({ value, validity, ev: ev as FocusEvent, elm });
        }
      } else if (eventType === 'invalid') {
        // "invalid" event
        if (!showNativeReport(elm)) {
          ev.preventDefault();
        }

        // add a space at the end to ensure we trigger a re-render
        ctrlState.e = elm.validationMessage + ' ';

        // a control is automatically "dirty" if it has been invalid at least once.
        ctrlState.d = true;
      } else {
        // "input" or "change" or keyboard events
        ctrlState.d = true;

        if (key === 'Escape' && ctrlData.resetOnEscape !== false) {
          setValueFromControlElement(ctrlData, elm, ctrlState.v);
          if (isFunction(ctrlData.onValueChange)) {
            ctrlData.onValueChange({ value: ctrlState.v, validity, ev, elm });
          }
        }

        if (key !== 'Enter' && key !== 'Escape' && isNumber(ctrlData.debounce)) {
          clearTimeout(inputDebounces.get(elm));
          inputDebounces.set(
            elm,
            setTimeout(() => checkValidity(ctrlData, elm, ev, setValueChange), ctrlData.debounce),
          );
        } else {
          checkValidity(ctrlData, elm, ev, setValueChange);
        }
      }
    } catch (e) {
      elm.setCustomValidity((ctrlState.e = String(e)));
      ctrlState.m = '';
    }
  }
};

const setValueChange = (ctrlData: ControlData, elm: ControlElement, value: any, ev: Event) => {
  if (ctrlData && elm) {
    const eventType = ev.type;
    const key = (ev as KeyboardEvent).key;
    const validity = elm.validity;
    const ctrlState: ControlState = (elm as any)[Control];
    ctrlState.d = true;

    if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
      ctrlData.onKeyDown({ key, value, validity, ev: ev as KeyboardEvent, elm });
    } else if (eventType === 'keyup') {
      if (isFunction(ctrlData.onKeyUp)) {
        ctrlData.onKeyUp!({ key, value, validity, ev: ev as KeyboardEvent, elm });
      }

      if (key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
        ctrlData.onEscapeKey!({ key, value, validity, ev: ev as KeyboardEvent, elm });
      } else if (key === 'Enter') {
        ctrlState.v = value;
        if (isFunction(ctrlData.onEnterKey)) {
          ctrlData.onEnterKey!({ key, value, validity, ev: ev as KeyboardEvent, elm });
        }
        if (isFunction(ctrlData.onCommit)) {
          ctrlData.onCommit!({ value, validity, ev: ev as KeyboardEvent, elm });
        }
      }
    } else if (isFunction(ctrlData.onValueChange)) {
      ctrlData.onValueChange!({ value, validity, ev, elm });
    }
  }
};
