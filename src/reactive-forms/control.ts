import { isFunction, isString, createRandomId } from './utils/helpers';
import { ctrlValueMap, getCtrlElmProps, formCtrlMap } from './utils/state';
import { ReactiveFormControl, ReactiveFormControlOptions, ReactiveFormControlGroup } from './utils/types';
import { sharedOnInputHandler, sharedOnInvalidHandler } from './handlers';

export const control = (form: ReactiveFormControl, value: any, ctrlOpts: ReactiveFormControlOptions = {}) => {
  const ctrl: ReactiveFormControl = { ...ctrlOpts };
  const props = getCtrlElmProps(ctrl);

  props.ref = (ctrlElm) => formCtrlMap.set(ctrlElm, ctrl);

  if (isString(ctrlOpts.name)) {
    props.name = ctrlOpts.name;
    props.id = isString(ctrlOpts.id) ? ctrlOpts.id : ctrlOpts.name;
  } else if (isString(ctrlOpts.id)) {
    props.name = props.id = ctrlOpts.id;
  } else {
    props.name = props.id = props.name = createRandomId('ctrl-' + form.id);
  }

  ctrlValueMap.set(ctrl, value);

  if (isFunction(ctrl.onInput) || isFunction(ctrl.onEnter) || isFunction(ctrl.onEscape)) {
    props.onInput = sharedOnInputHandler;
  }

  if (isFunction(ctrl.validate) || isFunction(ctrl.onInvalid)) {
    props.onInvalid = sharedOnInvalidHandler;
  }

  return ctrl;
};

export const controlGroup = (form: ReactiveFormControl, selectedValue: any, opts?: ReactiveFormControlOptions) => {
  const ctrlGroup: ReactiveFormControlGroup = { ...opts };
  if (isString(ctrlGroup.id)) {
    // we're good, "id" already set
  } else if (isString(ctrlGroup.name)) {
    // use the "name" as the id since "id" wasn't provided
    ctrlGroup.id = ctrlGroup.name;
  } else {
    // create a random id to identify this group
    ctrlGroup.id = createRandomId('ctrl-' + form.id);
  }
  ctrlValueMap.set(ctrlGroup, selectedValue);
  return ctrlGroup;
};
