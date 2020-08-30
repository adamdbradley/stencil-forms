import type { ControlElement, ControlData, ReactiveFormValuePropType } from './types';
import { isBoolean, isString } from './helpers';

export const getValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  const valuePropName = getValuePropName(ctrlData, ctrlElm);
  const value: any = (ctrlElm as any)[valuePropName];
  const valueType = typeof value;

  if (valueType === 'boolean' || valueType === 'number') {
    return value;
  } else if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  } else if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  } else {
    return String(value);
  }
};

export const setValueToControlElement = (ctrlData: ControlData, ctrlElm: ControlElement, value: any) => {
  const valuePropName = getValuePropName(ctrlData, ctrlElm);
  value = getPropValue(ctrlData.valuePropType!, value);
  if ((ctrlElm as any)[valuePropName] !== value) {
    // if it's not actually different, don't set the value which may change the cursor position
    (ctrlElm as any)[valuePropName] = getPropValue(ctrlData.valuePropType!, value);
  }
};

const getPropValue = (valueTypeCast: ReactiveFormValuePropType, value: any) => {
  // get the actual value we'll be assigning to the control element's
  // "value" or "checked" property. So it should actually only return a
  // string (for "value") or boolean (for "checked").
  if (isBoolean(value)) {
    return value;
  } else if (valueTypeCast === 'boolean') {
    // may have been give a string "true" or "false", so lets just
    // just always compare as a string boolean and return a boolean
    return String(value) === 'true';
  } else if (value == null || (valueTypeCast === 'number' && isNaN(value))) {
    // we don't want the word "null" "undefined" or "NaN" to be the value for
    // an <input> element, so check first and return it as an empty string
    return '';
  } else {
    // always assign the value as an actual string value, even for number
    return String(value);
  }
};

export const getValuePropName = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  if (isString(ctrlData.valuePropName)) {
    return ctrlData.valuePropName;
  } else if (ctrlElm.type === 'checkbox' || ctrlElm.type === 'radio') {
    return 'checked';
  } else {
    return 'value';
  }
};

export const setCastedBindValue = (instance: any, propName: string, value: any) => {
  const propType = typeof instance[propName];
  instance[propName] =
    propType === 'boolean' ? String(value) === 'true' : propType === 'number' ? parseFloat(value) : String(value);
};
