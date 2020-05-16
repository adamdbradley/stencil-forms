import { ctrlOptsMap, ctrlGroupsElmAttrsMap, ctrlMap, ctrlElmAttrsMap } from './utils/state';
import { isString } from './utils/helpers';
import {
  ReactiveFormControl,
  ReactiveFormControlOptions,
  ReactiveControlProperties,
  ReactiveFormControlGroup,
} from './utils/types';
import { sharedOnInputHandler, sharedOnInvalidHandler } from './handlers';

const controlInput = (value: any, isBooleanValue: boolean, ctrlOpts: ReactiveFormControlOptions) => {
  normalizeCtrlOpts(ctrlOpts);

  // create a map used by the containers to add attributes to the control element
  const attrMap = new Map<string, string>();

  // create the object to be used as a property spread in the render()
  const props: ReactiveControlProperties = {
    // get the reference to this form control element
    // and remember it so we can look up the form control by the element
    ref: (ctrlElm) => {
      ctrlMap.set(ctrlElm, ctrl);
      attrMap.forEach((attrValue, attrName) => ctrlElm.setAttribute(attrName, attrValue));
    },

    // add the shared event listeners
    onInput: sharedOnInputHandler,
    onInvalid: sharedOnInvalidHandler,

    // set the "id"
    id: ctrlOpts.id,

    // use the "name" if it's set, otherwise use the "id"
    name: ctrlOpts.name,
  };

  if (isBooleanValue) {
    props.checked = String(value) === 'true';
  } else {
    props.value = value != null ? String(value) : '';
  }

  // create the form control that'll be used as a weakmap key
  const ctrl: ReactiveFormControl = () => props;

  // remember the internal map to remember all the attributes to add
  ctrlElmAttrsMap.set(ctrl, attrMap);

  // remember the control options for this form control
  ctrlOptsMap.set(ctrl, ctrlOpts);

  // return form control is used as a key
  // and what's called to get all of the props
  return ctrl;
};

export const control = (value: any, ctrlOpts: ReactiveFormControlOptions) => controlInput(value, false, ctrlOpts);

export const controlBoolean = (value: any, ctrlOpts: ReactiveFormControlOptions) => controlInput(value, true, ctrlOpts);

export const controlGroup = (selectedValue: any, ctrlOpts: ReactiveFormControlOptions) => {
  normalizeCtrlOpts(ctrlOpts);

  // create a map used by the containers to add attributes to the control element
  const attrMap = new Map<string, string>();

  const groupItemAttrMap = new Map<string, Map<string, string>>();

  // create the object to be used as a property spread in the render()
  const props: ReactiveControlProperties = {
    id: ctrlOpts.id,
    role: 'group',
    ref: (ctrlElm) => attrMap.forEach((attrValue, attrName) => ctrlElm.setAttribute(attrName, attrValue)),
  };

  // create the form control that'll be used as a weakmap key
  const ctrl: ReactiveFormControlGroup = (groupItemValue?: any) => {
    if (isString(groupItemValue)) {
      // group item, like <input type="radio">
      return groupItem(selectedValue, ctrlOpts, groupItemAttrMap, groupItemValue);
    }

    // group container, like <div role="group">
    return props;
  };

  // remember the internal map for all the
  // attributes to add to the group container
  ctrlElmAttrsMap.set(ctrl, attrMap);

  // remember the internal map for all the
  // attributes to add to each
  ctrlGroupsElmAttrsMap.set(ctrl, groupItemAttrMap);

  // return form control is used as a key
  // and what's called to get all of the props
  return ctrl;
};

const groupItem = (
  selectedValue: any,
  ctrlOpts: ReactiveFormControlOptions,
  groupItemAttrMap: Map<string, Map<string, string>>,
  value: string,
) => {
  // grouped control input item, like <input type="radio">
  // a group only has one "value" and the individual radio that has
  // the same value as the group value is the "checked" radio

  // individual radios require a unique "id"
  // the "value" should already be unique, so let's use that
  const id = ctrlOpts.id + '-' + value;

  const props: ReactiveControlProperties = {
    // all radios in the group should have the same "name"
    // which comes from the control group's "name" if it's set
    // otherwise use the group's "id"
    name: isString(ctrlOpts.name) ? ctrlOpts.name : ctrlOpts.id,

    // group item "id"
    id,

    // group item "value"
    // individual radio should each have a unique "value" assigned
    value,

    // this radio is "checked" if its value is the same as the radio group's value
    // compare as strings so we can normalize any passed in boolean strings or actual booleans
    // however, it's always false if "selectedValue" is null or undefined
    checked: selectedValue != null ? String(selectedValue) === value : false,

    // ref for <input type="radio">
    ref: (groupItemElm: HTMLElement) => {
      groupItemAttrMap.get(id).forEach((attrValue, attrName) => groupItemElm.setAttribute(attrName, attrValue));
    },
  };

  return props;
};

const normalizeCtrlOpts = (ctrlOpts: ReactiveFormControlOptions) => {
  // if "name" isn't set, then use the "id"
  if (!isString(ctrlOpts.name)) {
    ctrlOpts.name = ctrlOpts.id;
  }
};
