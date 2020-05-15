import { controlOptsMap, controlGroupOptsMap, controlGroupValueMap, formCtrlMap, formCtrlIdsMap } from './utils/state';
import { isString, isNumber } from './utils/helpers';
import {
  ReactiveFormControl,
  ReactiveFormControlOptions,
  ReactiveForm,
  ReactiveControlProperties,
} from './utils/types';
import { sharedOnInputHandler, sharedOnInvalidHandler } from './handlers';

export const control = (form: ReactiveForm, value: any, ctrlOpts: ReactiveFormControlOptions = {}) => {
  normalizeIdAndName(form, ctrlOpts);

  // create the object to be used as a property spread in the render()
  const props: ReactiveControlProperties = {
    // get the reference to this form control element
    // and remember it so we can look up the form control by the element
    ref: (ctrlElm) => formCtrlMap.set(ctrlElm, ctrl),

    // add the shared event listeners
    onInput: sharedOnInputHandler,
    onInvalid: sharedOnInvalidHandler,

    // set the "id"
    id: ctrlOpts.id,

    // use the "name" if it's set, otherwise use the "id"
    name: ctrlOpts.name,

    // set the "value"
    value,
  };

  // create the form control that'll be used as a weakmap key
  const ctrl: ReactiveFormControl = () => props;

  // remember the control options for this form control
  controlOptsMap.set(ctrl, ctrlOpts);

  // return form control is used as a key
  // and what's called to get all of the props
  return ctrl;
};

export const controlGroup = (form: ReactiveForm, selectedValue: any, ctrlOpts: ReactiveFormControlOptions) => {
  normalizeIdAndName(form, ctrlOpts);

  // create the object to be used as a property spread in the render()
  const props: ReactiveControlProperties = {
    id: ctrlOpts.id,
    role: 'group',
  };

  // create the form control that'll be used as a weakmap key
  const ctrl: ReactiveFormControl = () => props;

  // remember the control options for this form control
  controlGroupOptsMap.set(ctrl, ctrlOpts);

  // remember the value for this group
  // which will be looked up by each group item to
  // test if it's the "checked" group item or not
  controlGroupValueMap.set(ctrl, selectedValue);

  // return form control is used as a key
  // and what's called to get all of the props
  return ctrl;
};

const normalizeIdAndName = (form: ReactiveForm, ctrlOpts: ReactiveFormControlOptions) => {
  // use the "id" if it's set, otherwise use the "name" if it's set
  // otherwise increment a number from the form instance
  if (!isString(ctrlOpts.id)) {
    if (isString(ctrlOpts.name)) {
      ctrlOpts.id = ctrlOpts.name;
    } else {
      let id = formCtrlIdsMap.get(form);
      id = isNumber(id) ? id++ : 0;
      ctrlOpts.id = form.id + '-' + id;
    }
  }

  if (!isString(ctrlOpts.name)) {
    ctrlOpts.name = ctrlOpts.id;
  }
};
