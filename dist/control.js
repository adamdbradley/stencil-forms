import { ctrlElmAttrsMap, ctrlGroupsElmAttrsMap, ctrlMap, ctrlOptsMap } from './utils/state';
import { isString, isFunction } from './utils/helpers';
import { sharedOnInvalidHandler, sharedOnValueChangeHandler, sharedOnFocus } from './handlers';
const controlInput = (value, isBooleanValue, ctrlOpts) => {
    normalizeCtrlOpts(ctrlOpts, isBooleanValue);
    // create a map used by the containers to add attributes to the control element
    const attrMap = new Map();
    // create the object to be used as a property spread in the render()
    const props = {
        // get the reference to this form control element
        // and remember it so we can look up the form control by the element
        ref: (ctrlElm) => {
            ctrlMap.set(ctrlElm, ctrl);
            attrMap.forEach((attrValue, attrName) => ctrlElm.setAttribute(attrName, attrValue));
        },
        // set the "id"
        id: ctrlOpts.id,
        // use the "name" if it's set, otherwise use the "id"
        name: ctrlOpts.name,
        // add the shared event listeners
        onInvalid: sharedOnInvalidHandler,
        [ctrlOpts.changeEventName]: sharedOnValueChangeHandler,
    };
    if (isFunction(ctrlOpts.onBlur)) {
        props.onBlur = sharedOnFocus;
    }
    if (isFunction(ctrlOpts.onFocus)) {
        props.onFocus = sharedOnFocus;
    }
    if (isBooleanValue) {
        props.checked = String(value) === 'true';
    }
    else {
        props.value = value != null ? String(value) : '';
    }
    // create the form control that'll be used as a weakmap key
    const ctrl = () => props;
    // remember the internal map to remember all the attributes to add
    ctrlElmAttrsMap.set(ctrl, attrMap);
    // remember the control options for this form control
    ctrlOptsMap.set(ctrl, ctrlOpts);
    // return control is used as a key
    // and what's called to get all of the props
    return ctrl;
};
export const control = (value, ctrlOpts) => controlInput(value, false, ctrlOpts);
export const controlBoolean = (value, ctrlOpts) => controlInput(value, true, ctrlOpts);
export const controlGroup = (selectedValue, ctrlOpts) => {
    normalizeCtrlOpts(ctrlOpts, true);
    // create a map used by the containers to add attributes to the control element
    const attrMap = new Map();
    const groupItemAttrMap = new Map();
    // create the object to be used as a property spread in the render()
    const props = {
        id: ctrlOpts.id,
        role: 'group',
        ref: (ctrlElm) => attrMap.forEach((attrValue, attrName) => ctrlElm.setAttribute(attrName, attrValue)),
    };
    // create the form control that'll be used as a weakmap key
    const ctrl = (groupItemValue) => {
        if (isString(groupItemValue)) {
            // group item, like <input type="radio">
            return groupItem(selectedValue, ctrl, ctrlOpts, groupItemAttrMap, groupItemValue);
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
const groupItem = (selectedValue, ctrl, ctrlOpts, groupItemAttrMap, value) => {
    // grouped control input item, like <input type="radio">
    // a group only has one "value" and the individual radio that has
    // the same value as the group value is the "checked" radio
    // individual radios require a unique "id"
    // the "value" should already be unique, so let's use that
    const id = ctrlOpts.id + '-' + value;
    const props = {
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
        [ctrlOpts.changeEventName]: sharedOnValueChangeHandler,
        // ref for <input type="radio">
        ref: (groupItemElm) => {
            ctrlMap.set(groupItemElm, ctrl);
            ctrlOptsMap.set(ctrl, ctrlOpts);
            groupItemAttrMap.get(id).forEach((attrValue, attrName) => groupItemElm.setAttribute(attrName, attrValue));
        },
    };
    return props;
};
const normalizeCtrlOpts = (ctrlOpts, isBooleanValue) => {
    // if "name" isn't set, then use the "id"
    if (!isString(ctrlOpts.name)) {
        ctrlOpts.name = ctrlOpts.id;
    }
    if (!isString(ctrlOpts.changeEventName)) {
        ctrlOpts.changeEventName = isBooleanValue ? 'onChange' : 'onInput';
    }
};
