import { inputControl, inputControlGroup } from './input-control';
import { ReactiveFormControlOptions, ReactiveFormValuePropType, ControlData } from './types';
import { state } from './utils/state';

export const control = (value: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'string'));

export const controlBoolean = (value: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(value, normalizeControlOpts(ctrlOpts, 'onChange', 'checked', 'boolean'));

export const controlNumber = (value: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'number'));

export const controlGroup = (selectedValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControlGroup(selectedValue, normalizeControlOpts(ctrlOpts, 'onChange', 'value', 'string'));

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
