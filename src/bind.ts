import type { ControlData, ReactiveFormBindOptions, ReactiveFormValuePropType } from './types';
import { inputControl, inputControlGroup } from './input-control';
import { instanceIds, state } from './state';
import { toDashCase } from './helpers';
import { setCastedBindValue } from './value';

export const bind = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName));

export const bindBoolean = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'boolean'));

export const bindNumber = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'number'));

export const bindGroup = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName));

const normalizeBindOpts = (
  bindOpts: ReactiveFormBindOptions | undefined,
  instance: any,
  propName: any,
  valuePropType: ReactiveFormValuePropType = 'string',
): ControlData => {
  let instanceId = instanceIds.get(instance);
  if (instanceId == null) {
    instanceIds.set(instance, (instanceId = state.i++));
  }
  return {
    i: toDashCase(propName) + instanceId,
    n: propName,
    valuePropType,
    ...bindOpts,
    onValueChange: ({ value }) => setCastedBindValue(instance, propName, value),
  };
};
