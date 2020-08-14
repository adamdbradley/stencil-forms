import { inputControl, inputControlGroup } from './input-control';
import type { ReactiveFormControlOptions, ReactiveFormValuePropType, ControlData } from './types';
import { state } from './state';

export const control = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts));

export const controlBoolean = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'boolean'));

export const controlNumber = (initialValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'number'));

export const controlGroup = (initialSelectedValue: any, ctrlOpts: ReactiveFormControlOptions) =>
  inputControlGroup(initialSelectedValue, normalizeControlOpts(ctrlOpts));

const normalizeControlOpts = (
  ctrlOpts: ReactiveFormControlOptions,
  valuePropType: ReactiveFormValuePropType = 'string',
): ControlData => {
  const propName = 'ctrl' + state.i++;
  return {
    i: propName,
    n: propName,
    valuePropType,
    ...ctrlOpts,
  };
};
