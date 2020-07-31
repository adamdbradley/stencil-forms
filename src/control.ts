import { inputControl, inputControlGroup } from './input-control';
import type { ReactiveFormControlOptions, ReactiveFormValuePropType, ControlData } from './types';
import { state } from './state';

export const control = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'string'));

export const controlBoolean = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onChange', 'checked', 'boolean'));

export const controlNumber = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'number'));

export const controlGroup = (initialSelectedValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControlGroup(initialSelectedValue, normalizeControlOpts(ctrlOpts, 'onChange', 'value', 'string'));

const normalizeControlOpts = (
  ctrlOpts: ReactiveFormControlOptions,
  changeEventName: string,
  valuePropName: string,
  valuePropType: ReactiveFormValuePropType,
): ControlData => {
  const propName = 'ctrl' + state.i++;
  return {
    i: propName,
    n: propName,
    changeEventName,
    valuePropName,
    valuePropType,
    ...ctrlOpts,
  };
};
