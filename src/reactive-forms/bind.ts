import { control, controlBoolean, controlGroup } from './control';
import { toDashCase } from './utils/helpers';
import type { ReactiveFormBindOptions, ReactiveFormControlOptions } from './utils/types';

export const bind = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => control(instance[propName], normalizeBindOpts(bindOpts, instance, propName));

export const bindBoolean = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => controlBoolean(instance[propName], normalizeBindOpts(bindOpts, instance, propName));

export const bindGroup = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => controlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName));

const normalizeBindOpts = (bindOpts: ReactiveFormBindOptions, instance: any, propName: any) => {
  const ctrlOpts: ReactiveFormControlOptions = {
    id: toDashCase(propName),
    name: propName,
    ...bindOpts,
    onValueChange: (value) => (instance[propName] = value),
  };
  return ctrlOpts;
};
