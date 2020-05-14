import type { ReactiveFormControl, ControlElement, ControlProperties } from './types';

export const formCtrlMap = new WeakMap<ControlElement, ReactiveFormControl>();

export const ctrlElmMap = new WeakMap<ReactiveFormControl, ControlElement>();

export const ctrlValueMap = new WeakMap<ReactiveFormControl, any>();

export const inputEvDebounceMap = new WeakMap<ControlElement, any>();

const ctrlPropertiesMap = new WeakMap<ReactiveFormControl, ControlProperties>();

export const getCtrlElmProps = (ctrl: ReactiveFormControl) => {
  let props = ctrlPropertiesMap.get(ctrl);
  if (!props) {
    // The "value" prop of <input> should be set after "min", "max", "type" and "step"
    // set the prop keys to the object now so if they're used they come before "value"
    ctrlPropertiesMap.set(ctrl, (props = { type: null, checked: null, min: null, max: null, id: null, name: null }));
  }
  return props;
};
