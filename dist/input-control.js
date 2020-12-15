import { ctrlChildren, ctrlDatas, ctrlElms, ctrlElmIds, ctrlStates, ctrls, labellingElms, setControlState, state, } from './state';
import { isFunction, isString, setAttribute } from './helpers';
import { getGroupChild, setDescribedbyAttributes, setErrormessageAttributes, setLabelledbyAttributes, } from './labelling-for';
import { checkValidity } from './validation';
import { sharedEventHandler } from './handlers';
import { setValueToControlElement } from './value';
export const inputControl = (value, ctrlData) => {
    // create the control arrow fn that'll be used as a weakmap key
    // and as a function to return the props for the control element
    const ctrlState = setControlState(value, ctrlData);
    const ctrl = () => {
        state.r = null;
        // create the object to be used as a property spread in the render()
        const props = {
            // get the reference to this form control element
            // and remember it so we can look up the form control by the element
            ref: (ctrlElm) => {
                if (ctrlElm) {
                    // Set the value of the element in these scenarios:
                    // - it's the first load
                    // TODO - the element has been moved in the DOM (or other re-render causes) => we need a flag to see if this is the case!
                    // console.log(`BF inputControl => ref`, { id: ctrlElm.getAttribute('id'), lastIndex: state.i, ctrlStates });
                    // if (ctrlState?.f || ctrlState?.d) {
                    setValueToControlElement(ctrlData, ctrlElm, value);
                    // }
                    ctrlElmRef(ctrl, ctrlData, ctrlState, ctrlElm, false);
                }
            },
            // add the shared event listeners
            onInvalid: sharedEventHandler,
            onInput: sharedEventHandler,
            onChange: sharedEventHandler,
            onKeyUp: sharedEventHandler,
            onFocus: sharedEventHandler,
            onBlur: sharedEventHandler,
        };
        if (isFunction(ctrlData.onKeyDown)) {
            props.onKeyDown = sharedEventHandler;
        }
        if (ctrlData.changeEventName) {
            props[ctrlData.changeEventName] = sharedEventHandler;
        }
        return props;
    };
    // add to the weakmap the data for this control
    ctrlDatas.set(ctrl, ctrlData);
    // return the control to be used as a key and what's
    // called to get all of the props for the control element
    return ctrl;
};
export const inputControlGroup = (selectedValue, ctrlData) => {
    const ctrlState = setControlState(selectedValue, ctrlData);
    // create the form control that'll be used as a weakmap key
    const ctrl = (groupItemValue) => {
        state.r = null;
        if (isString(groupItemValue)) {
            // group item, like <input type="radio">
            return inputControlGroupItem(selectedValue, ctrl, ctrlData, ctrlState, groupItemValue);
        }
        // group container, like <div role="group">
        return {
            role: 'group',
            ref: (ctrlElm) => ctrlElm && ctrlElmRef(ctrl, ctrlData, ctrlState, ctrlElm, true),
        };
    };
    ctrlChildren.set(ctrl, new Map());
    // remember the control data
    ctrlDatas.set(ctrl, ctrlData);
    // return form control is used as a key
    // and what's called to get all of the props
    return ctrl;
};
const inputControlGroupItem = (selectedGroupValue, parentCtrl, parentCtrlData, ctrlState, value) => {
    getGroupChild(parentCtrl, value);
    // grouped control input item, like <input type="radio"> a group
    // only has one "value" and the individual group item that has
    // the same "value" as the group value is the "checked" item
    const props = {
        // group item "value"
        // individual radio should each have a unique "value" assigned
        value,
        // this radio is "checked" if its "value" is the same as the group's "value"
        // compare as strings so we can normalize any passed in boolean strings or actual booleans
        // however, it's always false if the group's "selectedValue" is null or undefined
        checked: selectedGroupValue != null ? String(selectedGroupValue) === value : false,
        onFocus: sharedEventHandler,
        onBlur: sharedEventHandler,
        onInput: sharedEventHandler,
        onChange: sharedEventHandler,
        // ref for <input type="radio">
        ref: (childCtrlElm) => childCtrlElm && ctrlGroupItemElmRef(parentCtrl, ctrlState, childCtrlElm, value),
    };
    // console.log(`@stencil/forms, changeEventName`, parentCtrlData.changeEventName);
    if (parentCtrlData.changeEventName) {
        props[parentCtrlData.changeEventName] = sharedEventHandler;
    }
    return props;
};
const ctrlElmRef = (ctrl, ctrlData, ctrlState, ctrlElm, isParentGroup) => {
    // we just got a reference to the control input element
    let ctrlId = ctrlElm.getAttribute('id');
    let ctrlName = ctrlElm.getAttribute('name') || ctrlElm.name;
    let labellingElm = labellingElms[0 /* labelledby */].get(ctrl);
    if (!ctrlId) {
        ctrlId = ctrlData.i;
        if (!ctrlId) {
            ctrlId = ctrlElmIds.get(ctrlElm);
            if (!ctrlId) {
                ctrlElmIds.set(ctrlElm, (ctrlId = 'ctrl' + state.i++));
            }
        }
    }
    // since the labelling elements could have already rendered before the control element
    // we can now set the attribute information now that we have the "id" for the control element
    if (labellingElm) {
        // labelledby
        setLabelledbyAttributes(ctrlId, ctrlElm, labellingElm);
    }
    labellingElm = labellingElms[2 /* describedby */].get(ctrl);
    if (labellingElm) {
        // describedby
        setDescribedbyAttributes(ctrlId, ctrlElm, labellingElm);
    }
    labellingElm = labellingElms[1 /* errormessage */].get(ctrl);
    if (labellingElm) {
        // errormessage
        setErrormessageAttributes(ctrlId, ctrlElm, labellingElm);
    }
    if ((ctrlState === null || ctrlState === void 0 ? void 0 : ctrlState.e) !== '') {
        setAttribute(ctrlElm, 'aria-invalid', 'true');
    }
    else {
        ctrlElm.removeAttribute('aria-invalid');
    }
    ctrlData.i = setAttribute(ctrlElm, 'id', ctrlId);
    if (!isParentGroup) {
        if (!ctrlName) {
            ctrlName = ctrlData.n;
            if (!ctrlName) {
                ctrlName = ctrlId;
            }
        }
        ctrlData.n = setAttribute(ctrlElm, 'name', ctrlName);
    }
    ctrls.set(ctrlElm, ctrl);
    ctrlElms.set(ctrl, ctrlElm);
    ctrlStates.set(ctrlElm, ctrlState);
    if (ctrlState === null || ctrlState === void 0 ? void 0 : ctrlState.f) {
        checkValidity(ctrlData, ctrlState, ctrlElm, { ctrl: ctrlElm }, null);
        ctrlState.f = false;
    }
};
const ctrlGroupItemElmRef = (parentCtrl, ctrlState, childCtrlElm, childValue) => {
    const child = getGroupChild(parentCtrl, childValue);
    ctrlStates.set(childCtrlElm, ctrlState);
    return ctrlElmRef(child === null || child === void 0 ? void 0 : child.ctrl, child === null || child === void 0 ? void 0 : child.data, ctrlState, childCtrlElm, false);
};
