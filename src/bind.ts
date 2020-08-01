import type { ControlData, ReactiveFormBindOptions, ReactiveFormValuePropType } from './types';
import { toDashCase } from './helpers';
import { instanceIds, state } from './state';
import { inputControl, inputControlGroup } from './input-control';

export const bind = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'string'));

export const bindBoolean = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) =>
  inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'checked', 'boolean'));

export const bindNumber = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'number'));

export const bindGroup = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) =>
  inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'value', 'string'));

const normalizeBindOpts = (
  bindOpts: ReactiveFormBindOptions | undefined,
  instance: any,
  propName: any,
  changeEventName: string,
  valuePropName: string,
  valuePropType: ReactiveFormValuePropType,
): ControlData => {
  let instanceId = instanceIds.get(instance);
  if (instanceId == null) {
    instanceIds.set(instance, (instanceId = state.i++));
  }
  return {
    i: toDashCase(propName) + instanceId,
    n: propName,
    changeEventName,
    valuePropName,
    valuePropType,
    ...bindOpts,
    onValueChange: ({ value }) => (instance[propName] = value),
  };
};
