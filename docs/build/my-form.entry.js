import { g as getRenderingRef, f as forceUpdate, r as registerInstance, h, H as Host } from './index-098c57d7.js';

const isFunction = (v) => typeof v === 'function';
const isNumber = (v) => typeof v === 'number';
const isString = (v) => typeof v === 'string';
const isPromise = (v) => !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);
const toDashCase = (str) => str
    .toLowerCase()
    .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
    .trim()
    .replace(/ /g, '-');
const setAttribute = (elm, attrName, attrValue = '') => (elm.setAttribute(attrName, attrValue), attrValue);

const appendToMap = (map, propName, value) => {
    const items = map.get(propName);
    if (!items) {
        map.set(propName, [value]);
    }
    else if (!items.includes(value)) {
        items.push(value);
    }
};
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce((map) => {
    for (let key of map.keys()) {
        map.set(key, map.get(key).filter(isConnected));
    }
}, 2000);
const stencilSubscription = ({ on }) => {
    const elmsToUpdate = new Map();
    if (typeof getRenderingRef === 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        on('dispose', () => {
            elmsToUpdate.clear();
        });
        on('get', (propName) => {
            const elm = getRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        });
        on('set', (propName) => {
            const elements = elmsToUpdate.get(propName);
            if (elements) {
                elmsToUpdate.set(propName, elements.filter(forceUpdate));
            }
            cleanupElements(elmsToUpdate);
        });
        on('reset', () => {
            elmsToUpdate.forEach((elms) => elms.forEach(forceUpdate));
            cleanupElements(elmsToUpdate);
        });
    }
};

const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    let states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    const reset = () => {
        states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (typeof Proxy === 'undefined'
        ? {}
        : new Proxy(defaultState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        }));
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const unSet = on('set', (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        });
        const unReset = on('reset', () => cb(defaultState[propName]));
        return () => {
            unSet();
            unReset();
        };
    };
    const use = (...subscriptions) => subscriptions.forEach((subscription) => {
        if (subscription.set) {
            on('set', subscription.set);
        }
        if (subscription.get) {
            on('get', subscription.get);
        }
        if (subscription.reset) {
            on('reset', subscription.reset);
        }
    });
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    stencilSubscription(map);
    return map;
};

const state = {
    /**
     * Unique id incrementer
     */
    i: 0,
    /**
     * last rendering ref
     */
    r: null,
};
const ctrlElmIds = /*@__PURE__*/ new WeakMap();
const ctrlElms = /*@__PURE__*/ new WeakMap();
/**
 * Follows LabellingType index
 */
const labellingElms = [
    new WeakMap(),
    new WeakMap(),
    new WeakMap(),
];
const ctrlChildren = /*@__PURE__*/ new WeakMap();
const ctrls = /*@__PURE__*/ new WeakMap();
const ctrlDatas = /*@__PURE__*/ new WeakMap();
const debounces = /*@__PURE__*/ new WeakMap();
const InstanceId = /*@__PURE__*/ Symbol();
const CurrentControlIndex = /*@__PURE__*/ Symbol();
const Control = /*@__PURE__*/ Symbol();
const ControlStates = /*@__PURE__*/ Symbol();
const setControlState = (ctrlData) => {
    const renderingRef = getRenderingRef();
    const ctrlStates = (renderingRef[ControlStates] = renderingRef[ControlStates] || []);
    if (state.r !== renderingRef) {
        state.r = renderingRef;
        ctrlData.x = renderingRef[CurrentControlIndex] = 0;
    }
    else {
        ctrlData.x = ++renderingRef[CurrentControlIndex];
    }
    if (ctrlData.x === ctrlStates.length) {
        ctrlStates.push(createStore({
            validatingMessage: '',
            validationMessage: '',
        }).state);
    }
    return ctrlStates[ctrlData.x];
};
const getControlState = (ctrl) => {
    let renderingRef = getRenderingRef();
    let ctrlData;
    let ctrlStates;
    let ctrlElm;
    let ctrlState;
    if (renderingRef) {
        ctrlData = ctrlDatas.get(ctrl);
        if (ctrlData) {
            ctrlStates = renderingRef[ControlStates];
            if (ctrlStates) {
                ctrlState = ctrlStates[ctrlData.x];
                if (ctrlState) {
                    return ctrlState;
                }
            }
        }
    }
    ctrlElm = ctrlElms.get(ctrl);
    return ctrlElm ? ctrlElm[Control] : null;
};

const labellingFor = (ctrl, groupItemValue, labellingType, setAttrs) => {
    state.r = null;
    if (isString(groupItemValue)) {
        // labelling element for a group item input
        return {
            ref: (groupItemLabellingElm) => {
                if (groupItemLabellingElm) {
                    const child = getGroupChild(ctrl, groupItemValue);
                    const ctrlElm = ctrlElms.get(child.ctrl);
                    if (ctrlElm) {
                        // we already have the control element, so that means we'll
                        // have the "id" and "name" data to when setting the attrs
                        setAttrs(child.data.i, ctrlElm, groupItemLabellingElm);
                    }
                    else {
                        // we haven't gotten a reference to the control element yet
                        // so let's remember this labelling element for now and will
                        // add the attribute later once we get a ref to the control element
                        labellingElms[labellingType].set(child.ctrl, groupItemLabellingElm);
                    }
                }
            },
        };
    }
    // labelling element for a normal control
    // or labelling element for the wrapping group
    return {
        ref: (labellingElm) => {
            if (labellingElm) {
                // we now have the labelling element, which could happen before or
                // after having the control input element
                const ctrlElm = ctrlElms.get(ctrl);
                if (ctrlElm) {
                    // we already have the control element, so that means we'll
                    // have the "id" and "name" data to when setting the attrs
                    setAttrs(ctrlDatas.get(ctrl).i, ctrlElm, labellingElm);
                }
                else {
                    // we haven't gotten a reference to the control element yet
                    // so let's remember this labelling element for now and will
                    // add the attribute later once we get a ref to the control element
                    labellingElms[labellingType].set(ctrl, labellingElm);
                }
            }
        },
    };
};
const setDescribedbyAttributes = (ctrlId, ctrlElm, labellingElm) => setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'describedby', 'desc');
const setErrormessageAttributes = (ctrlId, ctrlElm, labellingElm) => {
    setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'errormessage', 'err');
    setAttribute(labellingElm, 'role', 'alert');
    setAttribute(labellingElm, 'aria-atomic', 'true');
    setAttribute(ctrlElm, 'formnovalidate');
};
const setLabelledbyAttributes = (ctrlId, ctrlElm, labellingElm) => {
    if (labellingElm) {
        if (labellingElm.nodeName === 'LABEL') {
            // labelling element is an actual <label> so we can use the "for" attribute
            setAttribute(labellingElm, 'for', ctrlId);
        }
        else {
            // labelling element is not a <label> so let's use "aria-labelledby" instead
            setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'labelledby', 'lbl');
        }
    }
};
const setAriaLinkedIdAttributes = (ctrlId, ctrlElm, labellingElm, ariaAttr, labellingIdSuffix) => setAttribute(ctrlElm, 'aria-' + ariaAttr, setAttribute(labellingElm, 'id', ctrlId + '-' + labellingIdSuffix));
const descriptionFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 2 /* describedby */, setDescribedbyAttributes);
const validationFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 1 /* errormessage */, setErrormessageAttributes);
const labelFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 0 /* labelledby */, setLabelledbyAttributes);
const getGroupChild = (parentCtrl, groupItemValue) => {
    const ctrlChildMap = ctrlChildren.get(parentCtrl);
    let child = ctrlChildMap.get(groupItemValue);
    if (!child) {
        const parentCtrlData = ctrlDatas.get(parentCtrl);
        if (!parentCtrlData.g) {
            parentCtrlData.g = parentCtrlData.n;
        }
        ctrlChildMap.set(groupItemValue, (child = {
            ctrl: {},
            data: {
                valuePropName: 'value',
                valuePropType: 'string',
                i: parentCtrlData.g + '-' + groupItemValue,
                n: parentCtrlData.g,
                onValueChange: parentCtrlData.onValueChange,
            },
        }));
        ctrlDatas.set(child.ctrl, child.data);
    }
    return child;
};

const checkValidity = (ctrlData, ctrlElm, ev, cb) => {
    if (ctrlElm && ctrlElm.validity) {
        const ctrlState = ctrlElm[Control];
        const value = getValueFromControlElement(ctrlData, ctrlElm);
        ctrlElm.setCustomValidity('');
        ctrlState.validationMessage = '';
        if (!ctrlElm.validity.valid) {
            // native browser constraint
            ctrlState.validationMessage = ctrlElm.validationMessage;
        }
        else if (isFunction(ctrlData.validate)) {
            // has custom validate fn and the native browser constraints are valid
            const results = ctrlData.validate(value, ev);
            if (isPromise(results)) {
                // results return a promise, let's wait on those
                const validatingMsg = isString(ctrlData.validatingMessage)
                    ? ctrlData.validatingMessage
                    : isFunction(ctrlData.validatingMessage)
                        ? ctrlData.validatingMessage(value, ev)
                        : `Validating...`;
                ctrlState.validatingMessage = validatingMsg;
                ctrlElm.setCustomValidity(validatingMsg);
                results.then((promiseResults) => checkValidateResults(promiseResults, ctrlData, ctrlElm, value, ev, cb));
            }
            else {
                // results were not a promise
                checkValidateResults(results, ctrlData, ctrlElm, value, ev, cb);
            }
        }
        else {
            // no validate fn
            checkValidateResults('', ctrlData, ctrlElm, value, ev, cb);
        }
    }
};
const checkValidateResults = (results, ctrlData, ctrlElm, value, ev, cb) => {
    const ctrlState = ctrlElm[Control];
    const msg = isString(results) ? results.trim() : '';
    ctrlElm.setCustomValidity(msg);
    ctrlState.validationMessage = msg;
    if (!ctrlElm.validity.valid) {
        const showNativeReport = !ctrlElm.hasAttribute('formnovalidate') && !(ctrlElm === null || ctrlElm === void 0 ? void 0 : ctrlElm.form.hasAttribute('novalidate'));
        if (showNativeReport) {
            ctrlElm.reportValidity();
        }
    }
    cb && cb(ctrlData, ctrlElm, value, ev);
};
const validationMessage = (ctrl) => {
    const ctrlElm = ctrlElms.get(ctrl);
    const ctrlState = getControlState(ctrl);
    if (ctrlElm) {
        setAttribute(ctrlElm, 'formnovalidate');
    }
    if (ctrlState) {
        return ctrlState.validationMessage;
    }
    return '';
};
const activeValidatingMessage = (ctrl) => {
    const ctrlState = getControlState(ctrl);
    if (ctrlState) {
        return ctrlState.validatingMessage;
    }
    return '';
};
const isActivelyValidating = (ctrl) => activeValidatingMessage(ctrl) !== '';
const isValid = (ctrl) => validationMessage(ctrl) === '';
const isInvalid = (ctrl) => validationMessage(ctrl) !== '';

const sharedOnInvalidHandler = (_ev) => {
    console.log('onInvalid', _ev);
};
const sharedOnValueChangeHandler = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    const value = getValueFromControlElement(ctrlData, ctrlElm);
    if (isNumber(ctrlData.debounce)) {
        clearTimeout(debounces.get(ctrlElm));
    }
    if (ev.key === 'Enter' || isFunction(ctrlData.onEnterKey)) {
        checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
        ctrlData.onEnterKey(value, ctrlElm.validity, ev);
    }
    else if (ev.key === 'Escape') {
        checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
        ctrlData.onEscapeKey(value, ctrlElm.validity, ev);
    }
    else if (isFunction(ctrlData.onValueChange)) {
        if (isNumber(ctrlData.debounce)) {
            debounces.set(ctrlElm, setTimeout(() => {
                const value = getValueFromControlElement(ctrlData, ctrlElm);
                checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
                ctrlData.onValueChange(value, ctrlElm.validity, ev);
            }, ctrlData.debounce));
        }
        else {
            checkValidity(ctrlData, ctrlElm, ev, afterInputValidity);
            ctrlData.onValueChange(value, ctrlElm.validity, ev);
        }
    }
};
const afterInputValidity = (ctrlData, ctrlElm, value, ev) => {
    ctrlData.onValueChange(value, ctrlElm.validity, ev);
};
const sharedOnFocus = (ev) => {
    const ctrlElm = ev.currentTarget;
    const ctrl = ctrls.get(ctrlElm);
    const ctrlData = ctrlDatas.get(ctrl);
    checkValidity(ctrlData, ctrlElm, ev, afterFocusValidity);
};
const afterFocusValidity = (opts, ctrlElm, value, ev) => {
    if (ev.type === 'focus') {
        if (isFunction(opts.onFocus)) {
            opts.onFocus(value, ctrlElm.validity, ev);
        }
    }
    else if (ev.type === 'blur') {
        if (isFunction(opts.onBlur)) {
            opts.onBlur(value, ctrlElm.validity, ev);
        }
    }
};
const getValueFromControlElement = (ctrlData, ctrlElm) => {
    const value = ctrlElm[ctrlData.valuePropName];
    if (ctrlData.valuePropType === 'boolean') {
        return String(value) === 'true';
    }
    if (ctrlData.valuePropType === 'number') {
        return parseFloat(value);
    }
    return String(value);
};

const inputControl = (value, ctrlData) => {
    // create the control arrow fn that'll be used as a weakmap key
    // and as a function to return the props for the control element
    const ctrlState = setControlState(ctrlData);
    const ctrl = () => {
        state.r = null;
        // create the object to be used as a property spread in the render()
        const props = {
            // set the value
            [ctrlData.valuePropName]: getPropValue(ctrlData.valuePropType, value),
            // get the reference to this form control element
            // and remember it so we can look up the form control by the element
            ref: (ctrlElm) => ctrlElm && ctrlElmRef(ctrl, ctrlData, ctrlState, ctrlElm, false),
            // add the shared event listeners
            onInvalid: sharedOnInvalidHandler,
            [ctrlData.changeEventName]: sharedOnValueChangeHandler,
        };
        if (isFunction(ctrlData.onFocus)) {
            props.onBlur = sharedOnFocus;
        }
        if (isFunction(ctrlData.onBlur)) {
            props.onFocus = sharedOnFocus;
        }
        return props;
    };
    // add to the weakmap the data for this control
    ctrlDatas.set(ctrl, ctrlData);
    // return the control to be used as a key and what's
    // called to get all of the props for the control element
    return ctrl;
};
const getPropValue = (valueTypeCast, value) => {
    // get the actual value we'll be assigning to the control element's
    // "value" or "checked" property. So it should actually only return a
    // string (for "value") or boolean (for "checked").
    if (valueTypeCast === 'boolean') {
        // may have been give a string "true" or "false", so lets just
        // just always compare as a string boolean and return a boolean
        return String(value) === 'true';
    }
    if (value == null || (valueTypeCast === 'number' && isNaN(value))) {
        // we don't want the word "null" "undefined" or "NaN" to be the value for
        // an <input> element, so check first and return it as an empty string
        return '';
    }
    // always assign the value as an actual string value, even for number
    return String(value);
};
const inputControlGroup = (selectedValue, ctrlData) => {
    const ctrlState = setControlState(ctrlData);
    // create the form control that'll be used as a weakmap key
    const ctrl = (groupItemValue) => {
        state.r = null;
        if (isString(groupItemValue)) {
            // group item, like <input type="radio">
            return inputControlGroupItem(selectedValue, ctrl, ctrlData, groupItemValue);
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
const inputControlGroupItem = (selectedGroupValue, parentCtrl, parentCtrlData, value) => {
    getGroupChild(parentCtrl, value);
    // grouped control input item, like <input type="radio"> a group
    // only has one "value" and the individual group item that has
    // the same "value" as the group value is the "checked" item
    return {
        // group item "value"
        // individual radio should each have a unique "value" assigned
        value,
        // this radio is "checked" if its "value" is the same as the group's "value"
        // compare as strings so we can normalize any passed in boolean strings or actual booleans
        // however, it's always false if the group's "selectedValue" is null or undefined
        checked: selectedGroupValue != null ? String(selectedGroupValue) === value : false,
        [parentCtrlData.changeEventName]: sharedOnValueChangeHandler,
        // ref for <input type="radio">
        ref: (childCtrlElm) => childCtrlElm && ctrlGroupItemElmRef(parentCtrl, childCtrlElm, value),
    };
};
const ctrlElmRef = (ctrl, ctrlData, ctrlState, ctrlElm, isParentGroup) => {
    // we just got a reference to the control input element
    let ctrlId = ctrlElm.getAttribute('id');
    let ctrlName = ctrlElm.getAttribute('name');
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
    if (ctrlState.validationMessage !== '') {
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
    ctrlElm[Control] = ctrlState;
    checkValidity(ctrlData, ctrlElm, null, null);
};
const ctrlGroupItemElmRef = (parentCtrl, childCtrlElm, childValue) => {
    const child = getGroupChild(parentCtrl, childValue);
    const ctrlState = setControlState(child.data);
    return ctrlElmRef(child.ctrl, child.data, ctrlState, childCtrlElm, false);
};

const bind = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'string'));
const bindBoolean = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'checked', 'boolean'));
const bindNumber = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'number'));
const bindGroup = (instance, propName, bindOpts) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'value', 'string'));
const normalizeBindOpts = (bindOpts, instance, propName, changeEventName, valuePropName, valuePropType) => {
    let instanceId = instance[InstanceId];
    if (instanceId == null) {
        instanceId = instance[InstanceId] = state.i++;
    }
    return Object.assign(Object.assign({ i: toDashCase(propName) + instanceId, n: propName, changeEventName,
        valuePropName,
        valuePropType }, bindOpts), { onValueChange: (value) => (instance[propName] = value) });
};

const control = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'string'));
const controlBoolean = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onChange', 'checked', 'boolean'));
const controlNumber = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'number'));
const controlGroup = (selectedValue, ctrlOpts) => inputControlGroup(selectedValue, normalizeControlOpts(ctrlOpts, 'onChange', 'value', 'string'));
const normalizeControlOpts = (ctrlOpts, changeEventName, valuePropName, valuePropType) => {
    const propName = 'ctrl' + state.i++;
    return Object.assign({ i: propName, n: propName, changeEventName,
        valuePropName,
        valuePropType }, ctrlOpts);
};

const myFormCss = "form button{position:relative;cursor:pointer;background:#ccc;margin:10px 0 0 0}form:invalid button::after{position:absolute;padding-left:20px;content:'form:invalid';color:red;white-space:nowrap}[role='alert']{color:red}input:valid{border:1px solid green}input:invalid{border:1px solid red}.is-validating{background:#eee;border:1px solid yellow}.is-valid{border:1px solid green}.is-invalid{border:1px solid red}";

const MyForm = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.fullName = 'Marty McFly';
        this.email = '';
        this.userName = '';
        this.age = 17;
        this.volume = 11;
        this.vegetarian = false;
        this.specialInstructions = '';
        this.favoriteCar = '';
        this.counter = 0;
        this.onSubmit = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const formData = new FormData(ev.currentTarget);
            const jsonData = JSON.stringify(Object.fromEntries(formData), null, 2);
            console.warn('submit', jsonData);
        };
    }
    render() {
        const fullName = bind(this, 'fullName');
        // const email = bind(this, 'email');
        // const userName = bind(this, 'userName', {
        //   debounce: 500,
        //   validatingMessage: (value) => `Checking if "${value}" is already taken...`,
        //   validate: (value) => {
        //     console.log(`checking "${value}" username...`);
        //     return new Promise((resolve) => {
        //       setTimeout(() => {
        //         console.log(`finished checking "${value}" username`);
        //         resolve();
        //       }, 5000);
        //     });
        //   },
        // });
        const age = bindNumber(this, 'age', {
            validate: (value) => {
                if (value < 18) {
                    return `Must be 18 or older, but you entered ${value}`;
                }
            },
        });
        // const volume = controlNumber(this.volume, {
        //   onValueChange: (value) => (this.volume = value),
        // });
        // const vegetarian = controlBoolean(this.vegetarian, {
        //   onValueChange: (value) => (this.vegetarian = value),
        // });
        // const specialInstructions = bind(this, 'specialInstructions');
        // const favoriteCar = controlGroup(this.favoriteCar, {
        //   onValueChange: (value) => (this.favoriteCar = value),
        // });
        return (h(Host, null, h("form", { onSubmit: this.onSubmit }, h("section", null, h("div", null, h("label", Object.assign({}, labelFor(age)), "Age")), h("div", Object.assign({}, descriptionFor(age)), "How many years young are you? ", this.age), h("div", null, h("input", Object.assign({ formNoValidate: true, type: "number", min: "0", max: "150" }, age()))), h("div", Object.assign({}, validationFor(age)), validationMessage(age))), h("section", null, h("button", { type: "submit" }, "Submit")), h("hr", null)), h("section", null, "Counter:", h("button", { onClick: () => this.counter-- }, "-"), " ", this.counter, ' ', h("button", { onClick: () => this.counter++ }, "+"))));
    }
};
MyForm.style = myFormCss;

export { MyForm as my_form };
