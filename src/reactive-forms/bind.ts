import { control, controlBoolean, controlGroup } from './control';
import { isString, toDashCase } from './utils/helpers';
import { ReactiveFormBindOptions, ReactiveFormControlOptions } from './utils/types';

export const bind = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => control(instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

export const bindBoolean = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => controlBoolean(instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

export const bindGroup = <T extends any, PropName extends keyof T>(
  instance: T,
  propName: PropName,
  bindOpts?: ReactiveFormBindOptions,
) => controlGroup(instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

const normalizeCtrlOptions = (bindOpts: ReactiveFormBindOptions, instance: any, propName: any) => {
  const ctrlOpts: ReactiveFormControlOptions = {
    id: toDashCase(propName),
    ...bindOpts,
    onValueChange: (value) => (instance[propName] = value),
  };

  if (!isString(ctrlOpts.name)) {
    // if a "name" wasn't provided let's use the propName
    // but keep the propName's format
    ctrlOpts.name = propName;
  }

  return ctrlOpts;
};
