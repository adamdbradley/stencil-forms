import { g as getRenderingRef, f as forceUpdate, r as registerInstance, h, e as Host } from './index-4b905869.js';

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
const inputDebounces = /*@__PURE__*/ new WeakMap();
const instanceIds = /*@__PURE__*/ new WeakMap();
const CurrentControlIndex = /*@__PURE__*/ Symbol();
const ctrlStates = /*@__PURE__*/ new WeakMap();
const ControlStates = /*@__PURE__*/ Symbol();
const setControlState = (initialValue, ctrlData) => {
  const renderingRef = getRenderingRef();
  if (!renderingRef) {
    return null;
  }
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
      f: true,
      d: false,
      t: false,
      m: '',
      e: '',
      c: 0,
      i: initialValue,
      l: null,
      g: null,
      n: null,
    }).state);
  }
  return ctrlStates[ctrlData.x];
};
const getControlState = (ctrl) => {
  let renderingRef = getRenderingRef();
  let ctrlData;
  let renderingRefCtrlStates;
  let ctrlElm;
  let ctrlState;
  if (renderingRef) {
    ctrlData = ctrlDatas.get(ctrl);
    if (ctrlData) {
      renderingRefCtrlStates = renderingRef[ControlStates];
      if (ctrlStates) {
        ctrlState = renderingRefCtrlStates[ctrlData.x];
        if (ctrlState) {
          return ctrlState;
        }
      }
    }
  }
  ctrlElm = ctrlElms.get(ctrl);
  return ctrlStates.get(ctrlElm) || {};
};

const isBoolean = (v) => typeof v === 'boolean';
const isFunction = (v) => typeof v === 'function';
const isNumber = (v) => typeof v === 'number';
const isString = (v) => typeof v === 'string';
const isPromise = (v) => !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);
const toDashCase = (str) => str
  .toLowerCase()
  .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
  .trim()
  .replace(/ /g, '-');
const setAttribute = (elm, attrName, attrValue = '') => (elm === null || elm === void 0 ? void 0 : elm.setAttribute(attrName, attrValue), attrValue);
const showNativeReport = (elm) => { var _a, _b; return !(elm === null || elm === void 0 ? void 0 : elm.hasAttribute('formnovalidate')) && !((_b = (_a = elm) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.hasAttribute('novalidate')); };

const checkValidity = (ctrlData, ctrlState, ctrlElm, event, cb) => {
  if (ctrlElm) {
    if (ctrlElm.validity && event.value !== ctrlState.l) {
      // need to do a new validation
      const callbackId = ++ctrlState.c;
      ctrlState.l = event.value;
      ctrlElm.setCustomValidity((ctrlState.e = ''));
      if (!ctrlElm.validity.valid) {
        // native browser constraint
        ctrlState.e = ctrlElm.validationMessage;
      }
      else if (isFunction(ctrlData.validate)) {
        // has custom validate fn and the native browser constraints are valid
        const results = ctrlData.validate(event);
        if (isPromise(results)) {
          // results return a promise, let's wait on those
          ctrlState.m = isString(ctrlData.activelyValidatingMessage)
            ? ctrlData.activelyValidatingMessage
            : isFunction(ctrlData.activelyValidatingMessage)
              ? ctrlData.activelyValidatingMessage(event)
              : `Validating...`;
          ctrlElm.setCustomValidity(ctrlState.m);
          results
            .then((promiseResults) => checkValidateResults(promiseResults, ctrlData, ctrlElm, event, callbackId, cb))
            .catch((err) => checkValidateResults(err, ctrlData, ctrlElm, event, callbackId, cb));
        }
        else {
          // results were not a promise
          checkValidateResults(results, ctrlData, ctrlElm, event, callbackId, cb);
        }
      }
      else {
        // no validate fn
        checkValidateResults('', ctrlData, ctrlElm, event, callbackId, cb);
      }
    }
    else if (isFunction(cb)) {
      // already validated this same value or element doesn't have validity
      cb(ctrlData, event);
    }
  }
};
const checkValidateResults = (results, ctrlData, ctrlElm, event, callbackId, cb) => {
  if (ctrlElm) {
    const ctrlState = ctrlStates.get(ctrlElm);
    if (ctrlState && (ctrlState.c === callbackId || (!ctrlElm.validity.valid && !ctrlElm.validity.customError))) {
      const msg = isString(results) ? results.trim() : '';
      ctrlElm.setCustomValidity(msg);
      ctrlState.e = ctrlElm.validationMessage;
      ctrlState.m = '';
      if (!ctrlElm.validity.valid && showNativeReport(ctrlElm)) {
        ctrlElm.reportValidity();
      }
    }
    if (isFunction(cb)) {
      cb(ctrlData, event);
    }
  }
};
const catchError = (ctrlState, event, err) => {
  event.ctrl.setCustomValidity((ctrlState.e = String(err.message || err)));
  ctrlState.m = '';
};
/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns the message provided by the browser and
 * the custom validation method will not be called. If the value does
 * pass constraint validation then the custom `validation()` method
 * will be called and returns the message. If the value passes both the
 * constraint validation and custom valdation, then this method returns
 * and empty string.
 */
const validationMessage = (ctrl) => {
  const ctrlElm = ctrlElms.get(ctrl);
  const ctrlState = getControlState(ctrl);
  setAttribute(ctrlElm, 'formnovalidate');
  if (ctrlState && (ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e;
  }
  return '';
};
/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return the message provided in `validatingMessage`.
 * All other times this method will return an empty string.
 */
const activelyValidatingMessage = (ctrl) => {
  const ctrlState = getControlState(ctrl);
  if (ctrlState) {
    return ctrlState.m;
  }
  return '';
};
/**
 * If a custom validation method was provided, and returns a promise,
 * this method will return `true` if the validation method is still pending.
 * All other times this method will return `false`.
 */
const isActivelyValidating = (ctrl) => activelyValidatingMessage(ctrl) !== '';
/**
 * If the value has changed, or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `false` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `false`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `true`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
const isValid = (ctrl) => {
  const ctrlState = getControlState(ctrl);
  if ((ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e === '';
  }
  return null;
};
/**
 * If the value has changed or control has been "touched",
 * and if the value does not pass the browser's
 * [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
 * then this method returns `true` and the custom validation method
 * will not be called. If the value does pass constraint validation
 * then the custom `validation()` method will be called, and if the
 * custom validation method returns a message then this method will
 * return `true`. If the value passes both the constraint validation
 * and custom valdation, then this method returns `false`. However,
 * if custom validation is async and is pending a response then this
 * method will return `null`.
 */
const isInvalid = (ctrl) => {
  const ctrlState = getControlState(ctrl);
  if ((ctrlState.d || ctrlState.t) && ctrlState.m === '') {
    return ctrlState.e !== '';
  }
  return null;
};
/**
 * When the user changes the value of the form control element, the
 * control is "dirty" and this method returns `true`. If control's
 * initial value has not changed then this method returns `false`.
 */
const isDirty = (ctrl) => !!getControlState(ctrl).d;
/**
 * When the user blurs the form control element, the control is
 * marked as "touched" and this method returns `true`. If the
 * control has not had a blur event then this method will return
 * `false`.
 */
const isTouched = (ctrl) => !!getControlState(ctrl).t;
const submitValidity = (message) => {
  return {
    ref(btn) {
      btn.setCustomValidity(message !== null && message !== void 0 ? message : '');
    },
  };
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
      var _a;
      if (labellingElm) {
        // we now have the labelling element, which could happen before or
        // after having the control input element
        const ctrlElm = ctrlElms.get(ctrl);
        if (ctrlElm) {
          // we already have the control element, so that means we'll
          // have the "id" and "name" data to when setting the attrs
          setAttrs((_a = ctrlDatas.get(ctrl)) === null || _a === void 0 ? void 0 : _a.i, ctrlElm, labellingElm);
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
/**
 * The `descriptionFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that described it. This is very similar to
 * label, but the description provides more information that the user might need.
 * When using this method, the element it's attached to will automatically link
 * up the description by adding the `aria-describedby` attribute to the control
 * element, and a unique id to the description element.
 */
const descriptionFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 2 /* describedby */, setDescribedbyAttributes);
/**
 * The `validationFor(ctrl)` method is used to establish a relationship between
 * an input control and it's error message. When using this method, the element
 * it's attached to will automatically link up the error by adding the
 * `aria-errormessage` attribute to the control element, and a unique id to the
 * message element. Additionally, it will add `role="alert"` and `aria-atomic="true"`
 * to the message element.
 */
const validationFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 1 /* errormessage */, setErrormessageAttributes);
/**
 * The `labelFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that labels it. When the labelling element is
 * an actual `<label>`, it will add the `for` attribute to the label, pointing
 * it to the correct control id. When the labelling element is not a `<label>`
 * it will then use `aria-labelledby`.
 */
const labelFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 0 /* labelledby */, setLabelledbyAttributes);
const getGroupChild = (parentCtrl, groupItemValue) => {
  const ctrlChildMap = ctrlChildren.get(parentCtrl);
  if (!ctrlChildMap) {
    return;
  }
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
        onCommit: parentCtrlData.onCommit,
      },
    }));
    ctrlDatas.set(child.ctrl, child.data);
  }
  return child;
};

const getValueFromControlElement = (ctrlData, ctrlElm) => {
  const valuePropName = getValuePropName(ctrlData, ctrlElm);
  const value = ctrlElm[valuePropName];
  const valueType = typeof value;
  if (valueType === 'boolean' || valueType === 'number') {
    return value;
  }
  else if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  }
  else if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  }
  else {
    return String(value);
  }
};
const setValueToControlElement = (ctrlData, ctrlElm, value) => {
  const valuePropName = getValuePropName(ctrlData, ctrlElm);
  value = getPropValue(ctrlData.valuePropType, value);
  if (ctrlElm[valuePropName] !== value) {
    // if it's not actually different, don't set the value which may change the cursor position
    ctrlElm[valuePropName] = getPropValue(ctrlData.valuePropType, value);
  }
};
const getPropValue = (valueTypeCast, value) => {
  // get the actual value we'll be assigning to the control element's
  // "value" or "checked" property. So it should actually only return a
  // string (for "value") or boolean (for "checked").
  if (isBoolean(value)) {
    return value;
  }
  else if (valueTypeCast === 'boolean') {
    // may have been give a string "true" or "false", so lets just
    // just always compare as a string boolean and return a boolean
    return String(value) === 'true';
  }
  else if (value == null || (valueTypeCast === 'number' && isNaN(value))) {
    // we don't want the word "null" "undefined" or "NaN" to be the value for
    // an <input> element, so check first and return it as an empty string
    return '';
  }
  else {
    // always assign the value as an actual string value, even for number
    return String(value);
  }
};
const getValuePropName = (ctrlData, ctrlElm) => {
  if (isString(ctrlData.valuePropName)) {
    return ctrlData.valuePropName;
  }
  else if (ctrlElm.type === 'checkbox' || ctrlElm.type === 'radio') {
    return 'checked';
  }
  else {
    return 'value';
  }
};
const setCastedBindValue = (instance, propName, value) => {
  const propType = typeof instance[propName];
  instance[propName] =
    propType === 'boolean' ? String(value) === 'true' : propType === 'number' ? parseFloat(value) : String(value);
};

const sharedEventHandler = (ev) => {
  const ctrlElm = ev.currentTarget;
  const ctrl = ctrls.get(ctrlElm);
  const ctrlData = ctrlDatas.get(ctrl);
  if (ctrl && ctrlData) {
    const ctrlState = getControlState(ctrl);
    const type = ev.type;
    const key = ev.key;
    const rtns = [];
    const event = {
      value: getValueFromControlElement(ctrlData, ctrlElm),
      initialValue: ctrlState.i,
      validity: ctrlElm.validity,
      key,
      type,
      ev: ev,
      ctrl: ctrlElm,
    };
    try {
      if (type === 'blur') {
        // "blur" event
        ctrlState.t = true;
        if (isFunction(ctrlData.onBlur)) {
          rtns.push(ctrlData.onBlur(event));
        }
      }
      else if (type === 'focus') {
        // "focus" event
        // reset "initialValue" state
        ctrlState.i = event.initialValue = event.value;
        if (!ctrlState.t && isFunction(ctrlData.onTouch)) {
          // onTouch should only fire on the first focus
          rtns.push(ctrlData.onTouch(event));
        }
        if (isFunction(ctrlData.onFocus)) {
          rtns.push(ctrlData.onFocus(event));
        }
      }
      else if (type === 'invalid') {
        // "invalid" event
        if (!showNativeReport(ctrlElm)) {
          ev.preventDefault();
        }
        // add a space at the end to ensure we trigger a re-render
        ctrlState.e = ctrlElm.validationMessage + ' ';
        // a control is automatically "dirty" if it has been invalid at least once.
        ctrlState.d = true;
      }
      else {
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
          inputDebounces.set(ctrlElm, setTimeout(() => checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange), ctrlData.debounce));
        }
        else if (!(key === 'Enter' && ctrlElm.nodeName === 'TEXTAREA')) {
          checkValidity(ctrlData, ctrlState, ctrlElm, event, setValueChange);
        }
      }
      Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
    }
    catch (e) {
      catchError(ctrlState, event, e);
    }
  }
};
const setValueChange = (ctrlData, event) => {
  if (ctrlData && event && event.ctrl && event.ctrl.parentNode) {
    const ctrlState = ctrlStates.get(event.ctrl);
    const rtns = [];
    const eventType = event.type;
    if (ctrlState) {
      try {
        ctrlState.d = true;
        if (eventType === 'keydown' && isFunction(ctrlData.onKeyDown)) {
          rtns.push(ctrlData.onKeyDown(event));
        }
        else if (eventType === 'keyup') {
          if (isFunction(ctrlData.onKeyUp)) {
            rtns.push(ctrlData.onKeyUp(event));
          }
          if (event.key === 'Escape' && isFunction(ctrlData.onEscapeKey)) {
            rtns.push(ctrlData.onEscapeKey(event));
          }
          else if (event.key === 'Enter') {
            ctrlState.i = eventType;
            if (isFunction(ctrlData.onEnterKey)) {
              rtns.push(ctrlData.onEnterKey(event));
            }
            if (ctrlState.n !== event.value && isFunction(ctrlData.onCommit)) {
              ctrlState.n = event.value;
              rtns.push(ctrlData.onCommit(event));
            }
          }
        }
        else if (ctrlState.g !== event.value && isFunction(ctrlData.onValueChange)) {
          ctrlState.g = event.value;
          rtns.push(ctrlData.onValueChange(event));
        }
        if (eventType === 'change' && ctrlState.n !== event.value && isFunction(ctrlData.onCommit)) {
          // onCommit on blur event and Enter key event
          ctrlState.n = event.value;
          rtns.push(ctrlData.onCommit(event));
        }
        Promise.all(rtns).catch((err) => catchError(ctrlState, event, err));
      }
      catch (e) {
        catchError(ctrlState, event, e);
      }
    }
  }
};

const inputControl = (value, ctrlData) => {
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
          if (ctrlState === null || ctrlState === void 0 ? void 0 : ctrlState.f) {
            setValueToControlElement(ctrlData, ctrlElm, value);
          }
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
const inputControlGroup = (selectedValue, ctrlData) => {
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
  if (parentCtrlData.changeEventName) {
    props[parentCtrlData.changeEventName] = sharedEventHandler;
  }
  return props;
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

const bind = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
const bindBoolean = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'boolean'));
const bindNumber = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'number'));
const bindGroup = (instance, propName, bindOpts) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
const normalizeBindOpts = (bindOpts, instance, propName, valuePropType = 'string') => {
  let instanceId = instanceIds.get(instance);
  if (instanceId == null) {
    instanceIds.set(instance, (instanceId = state.i++));
  }
  return Object.assign(Object.assign({ i: toDashCase(propName) + instanceId, n: propName, valuePropType }, bindOpts), { onValueChange: ({ value }) => setCastedBindValue(instance, propName, value) });
};

const control = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts));
const controlBoolean = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'boolean'));
const controlNumber = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'number'));
const controlGroup = (initialSelectedValue, ctrlOpts) => inputControlGroup(initialSelectedValue, normalizeControlOpts(ctrlOpts));
const normalizeControlOpts = (ctrlOpts, valuePropType = 'string') => {
  const propName = 'ctrl' + state.i++;
  return Object.assign({ i: propName, n: propName, valuePropType }, ctrlOpts);
};

const myFormCss = "body{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', 'Helvetica Neue', sans-serif}form button{position:relative;cursor:pointer;background:#ccc;margin:10px 0 0 0;padding:5px;font-size:16px}form:invalid button{background:#eee;color:#aaa}form:invalid button::after{position:absolute;padding-left:20px;content:'form:invalid';color:red;white-space:nowrap}form:valid button::after{position:absolute;padding-left:20px;content:'form:valid';color:green;white-space:nowrap}label,.group-label{font-weight:bold}[role='alert']{color:red}input:valid{border:1px solid green}input:invalid{border:1px solid red}.is-validating{background:rgba(255, 255, 0, 0.2)}.is-valid{background:rgba(0, 128, 0, 0.2)}.is-invalid{background:rgba(255, 0, 0, 0.1)}.actively-validating{background-color:#ddd;font-style:italic}.is-dirty{color:purple}.is-touched{color:blue}pre{background:#eee;padding:10px}section{padding:10px;border-bottom:1px solid gray}section:last-child{border-bottom:none}.counter{font-size:12px}";

const MyForm = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.login = false;
    this.fullName = 'Marty McFly';
    this.email = '';
    this.userName = '';
    this.age = 17;
    this.volume = 11;
    this.vegetarian = false;
    this.busy = true;
    this.specialInstructions = '';
    this.favoriteCar = '';
    this.carBodyStyle = '';
    this.hoodScoop = false;
    this.counter = 0;
    this.json = '';
    this.onSubmit = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const formData = new FormData(ev.currentTarget);
      this.json = JSON.stringify(Object.fromEntries(formData), null, 2);
      console.warn('submit', this.json);
    };
  }
  componentWillLoad() {
    const search = new URLSearchParams(document.location.search);
    if (search.get('token') === 'test') {
      this.login = true;
    }
  }
  render() {
    const fullName = bind(this, 'fullName');
    const email = bind(this, 'email');
    const userName = bind(this, 'userName', {
      debounce: 500,
      activelyValidatingMessage: ({ value }) => `Checking if "${value}" is already taken...`,
      validate: ({ value }) => {
        console.log(`async checking "${value}" username, this will take 3 seconds...`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`finished checking "${value}" username`);
            resolve();
          }, 3000);
        });
      },
      onCommit({ value }) {
        console.log(`userName commit: ${value}`);
      },
    });
    const validateAge = (event) => {
      if (event.value < 18) {
        return `Must be 18 or older, but you entered ${event.value}`;
      }
    };
    const age = bind(this, 'age', {
      validate: validateAge,
      onCommit({ value }) {
        console.log(`age commit: ${value}`);
      },
    });
    const volume = control(this.volume, {
      onValueChange: ({ value }) => {
        this.volume = value;
      },
      onCommit({ value }) {
        console.log(`volume commit: ${value}`);
      },
    });
    const vegetarian = controlBoolean(this.vegetarian, {
      onValueChange: ({ value }) => (this.vegetarian = !!value),
      onCommit({ value }) {
        console.log(`vegetarian commit: ${value}`);
      },
    });
    const busy = bindBoolean(this, 'busy', {
      onCommit({ value }) {
        console.log(`busy commit: ${value}`);
      },
    });
    const specialInstructions = bind(this, 'specialInstructions', {
      onKeyDown: ({ key, value }) => {
        console.log('onKeyDown, key', key, 'value', value);
      },
      onKeyUp: ({ key, value }) => {
        console.log('onKeyUp, key', key, 'value', value);
      },
      onCommit({ value }) {
        console.log(`special instructions commit: ${value}`);
      },
    });
    const favoriteCar = controlGroup(this.favoriteCar, {
      onValueChange: ({ value }) => (this.favoriteCar = value),
      onCommit({ value }) {
        console.log(`favorite car commit: ${value}`);
      },
    });
    const carBodyStyle = bind(this, 'carBodyStyle', {
      validate({ value }) {
        if (!value) {
          return 'Select a body style';
        }
      },
      onCommit({ value }) {
        console.log(`car body style commit: ${value}`);
      },
    });
    const hoodScoop = bind(this, 'hoodScoop', {
      onCommit({ value }) {
        console.log(`hood scoop commit: ${value}`);
      },
    });
    return (h(Host, null, h("form", { onSubmit: this.onSubmit }, h("section", null, h("div", null, h("label", Object.assign({}, labelFor(fullName)), "Name")), h("div", Object.assign({}, descriptionFor(fullName)), "What's your full name? ", this.fullName), h("div", null, h("input", Object.assign({ required: true }, fullName()))), h("span", Object.assign({}, validationFor(fullName)), validationMessage(fullName))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(email)), "Email")), h("div", Object.assign({ class: {
        'is-dirty': isDirty(email),
      } }, descriptionFor(email)), "(Purple means the input is \"dirty\" because the value has changed)"), h("div", null, h("input", Object.assign({ id: "my-email-id", name: "my-email-name", type: "email", required: true }, email()))), h("div", Object.assign({}, validationFor(email)), validationMessage(email))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(age)), "Age")), h("div", Object.assign({ class: {
        'is-touched': isTouched(age),
      } }, descriptionFor(age)), "(Blue means it's \"touched\" because the blur event happened)"), h("div", null, h("input", Object.assign({ type: "number", min: "0", max: "150" }, age()))), h("div", Object.assign({}, validationFor(age)), validationMessage(age))), h("section", { class: {
        'is-validating': isActivelyValidating(userName),
        'is-valid': isValid(userName),
        'is-invalid': isInvalid(userName),
      } }, h("div", null, h("label", Object.assign({}, labelFor(userName)), "User Name")), h("div", Object.assign({}, descriptionFor(userName)), "(500ms debounce, 3s async validation)"), h("div", null, h("input", Object.assign({ required: true }, userName()))), h("div", { class: "actively-validating", hidden: !isActivelyValidating(userName) }, activelyValidatingMessage(userName)), h("div", Object.assign({}, validationFor(userName)), validationMessage(userName))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(volume)), "Volume")), h("div", Object.assign({}, descriptionFor(age)), "These go to eleven: ", this.volume), h("div", null, h("input", Object.assign({ type: "range", min: "0", max: "11" }, volume()))), h("div", Object.assign({}, validationFor(volume)), validationMessage(volume))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(vegetarian)), "Vegetarian")), h("div", Object.assign({}, descriptionFor(vegetarian)), "Are you a vegetarian? ", String(this.vegetarian)), h("div", null, h("input", Object.assign({ type: "checkbox" }, vegetarian()))), h("div", Object.assign({}, validationFor(vegetarian)), validationMessage(vegetarian))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(busy)), "Busy: ", String(this.busy))), h("div", null, h("input", Object.assign({ type: "checkbox" }, busy())))), h("section", null, h("div", null, h("label", Object.assign({}, labelFor(specialInstructions)), "Special Instructions")), h("div", Object.assign({}, descriptionFor(specialInstructions)), "(Uses the browser's default error popup message, rather than using a custom validationFor() method.)"), h("div", null, h("textarea", Object.assign({ required: true }, specialInstructions())))), h("section", Object.assign({}, favoriteCar()), h("div", Object.assign({ class: "group-label" }, labelFor(favoriteCar)), "Favorite Car"), h("div", Object.assign({}, descriptionFor(favoriteCar)), "What's your favorite car? ", this.favoriteCar), h("div", null, h("label", Object.assign({}, labelFor(favoriteCar, 'mustang')), "Mustang"), h("input", Object.assign({ type: "radio" }, favoriteCar('mustang')))), h("div", null, h("label", Object.assign({}, labelFor(favoriteCar, 'camaro')), "Camaro"), h("input", Object.assign({ type: "radio" }, favoriteCar('camaro')))), h("div", null, h("label", Object.assign({}, labelFor(favoriteCar, 'challenger')), "Challenger"), h("input", Object.assign({ type: "radio" }, favoriteCar('challenger')))), h("div", Object.assign({}, validationFor(favoriteCar)), validationMessage(favoriteCar))), h("section", null, h("label", Object.assign({}, labelFor(carBodyStyle)), "Car Body Style: ", this.carBodyStyle), h("div", null, h("select", Object.assign({}, carBodyStyle()), h("option", null), h("option", { value: "fastback" }, "Fastback"), h("option", { value: "coupe" }, "Coupe"), h("option", { value: "convertible" }, "Convertible")), h("div", Object.assign({}, validationFor(carBodyStyle)), validationMessage(carBodyStyle)))), h("section", null, h("label", Object.assign({}, labelFor(hoodScoop)), "Hood Scoop: ", String(this.hoodScoop)), h("div", null, h("select", Object.assign({}, hoodScoop()), h("option", { selected: this.hoodScoop }, "true"), h("option", { selected: !this.hoodScoop }, "false")))), h("section", null, h("button", Object.assign({ type: "submit" }, submitValidity(!this.login ? 'Bad auth. Add ?token=test' : undefined)), "Submit"))), this.json !== '' ? h("pre", null, "Form Submit ", this.json) : null, h("section", { class: "counter" }, "Counter (just to test re-rendering scenarios):", h("button", { onClick: () => this.counter-- }, "-"), " ", this.counter, ' ', h("button", { onClick: () => this.counter++ }, "+"))));
  }
};
MyForm.style = myFormCss;

export { MyForm as my_form };
