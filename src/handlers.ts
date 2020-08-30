import { checkValidity, catchError } from './validation';
import type { ControlElement, ControlData, ReactiveFormEvent } from './types';
import { ctrls, ctrlDatas, ctrlStates, getControlState, inputDebounces } from './state';
import { getValueFromControlElement, setValueToControlElement } from './value';
import { isFunction, isNumber, showNativeReport } from './helpers';

export const sharedEventHandler = (ev: Event) => {
  const ctrlElm = ev.currentTarget as ControlElement;
  const ctrl = ctrls.get(ctrlElm)!;
  const ctrlData = ctrlDatas.get(ctrl)!;

  if (ctrl && ctrlData) {
    const ctrlState = getControlState(ctrl);
    const type = ev.type;
    const key = (ev as KeyboardEvent).key;
    const rtns: any[] = [];
    const event: ReactiveFormEvent = {
      value: getValueFromControlElement(ctrlData, ctrlElm),
      initialValue: ctrlState.i,
      validity: ctrlElm.validity,
      key,
      type,
      ev: ev as any,
      ctrl: ctrlElm,
    };

    try {
      if (type === 'blur') {
        // "blur" event
        ctrlState.t = true;

        if (isFunction(ctrlData.onBlur)) {
          rtns.push(ctrlData.onBlur(event as any));
        }
      } else if (type === 'focus') {
        // "focus" event
        // reset "initialValue" state
        ctrlState.i = event.initialValue = event.value;

        if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
          // onTouch should only fire on the first focus
          rtns.push(ctrlData.onTouch(event as any));
        }
        if (isFunction(ctrlData.onFocus)) {
          rtns.push(ctrlData.onFocus(event as any));
        }
      } else if (type === 'invalid') {
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
          setValueToControlElement(ctrlData, ctrlElm, ctrlState.i);
          if (isFunction(ctrlData.onValueChange)) {
            event.value = ctrlState.i;
            rtns.push(ctrlData.onValueChange(event));
          }
        }

        if (key !== 'Enter' && key !== 'Escape' && isNumber(ctrlData.debounce)) {
          clearTimeout(inputDebounces.get(ctrlElm));
          inputDebounces.set(
            ctrlElm,
            setTimeout(() => checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange), ctrlData.debounce),
          );
        } else if (!(key === 'Enter' && ctrlElm.nodeName === 'TEXTAREA')) {
          checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange);
        }
      }

      Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
    } catch (e) {
      catchError(ctrlState, event, e);
    }
  }
};

const setValueChange = (ctrlData: ControlData, event: ReactiveFormEvent) => {
  if (ctrlData && event && event.ctrl && event.ctrl.parentNode) {
    const ctrlState = ctrlStates.get(event.ctrl!);
    const rtns: (any | Promise<any>)[] = [];
    const eventType = event.type;

    if (ctrlState) {
      try {
        ctrlState.d = true;

        if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
          rtns.push(ctrlData.onKeyDown(event));
        } else if (eventType === 'keyup') {
          if (isFunction(ctrlData.onKeyUp)) {
            rtns.push(ctrlData.onKeyUp!(event));
          }

          if (event.key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
            rtns.push(ctrlData.onEscapeKey!(event));
          } else if (event.key === 'Enter') {
            ctrlState.i = eventType;
            if (isFunction(ctrlData.onEnterKey)) {
              rtns.push(ctrlData.onEnterKey!(event));
            }
            if (ctrlState.n !== event.value && isFunction(ctrlData.onCommit)) {
              ctrlState.n = event.value;
              rtns.push(ctrlData.onCommit!(event));
            }
          }
        } else if (ctrlState.g !== event.value && isFunction(ctrlData.onValueChange)) {
          ctrlState.g = event.value;
          rtns.push(ctrlData.onValueChange!(event));
        }

        if (eventType === 'change' && ctrlState.n !== event.value && isFunction(ctrlData.onCommit)) {
          // onCommit on blur event and Enter key event
          ctrlState.n = event.value;
          rtns.push(ctrlData.onCommit!(event as any));
        }

        Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
      } catch (e) {
        catchError(ctrlState, event, e);
      }
    }
  }
};
