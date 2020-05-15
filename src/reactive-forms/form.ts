import type {
  ReactiveForm,
  ReactiveFormOptions,
  ReactiveFormBindOptions,
  ReactiveFormControlOptions,
} from './utils/types';
import { control, controlGroup } from './control';
import { isString, toDashCase } from './utils/helpers';

export const reactiveForm = (formOpts: ReactiveFormOptions) => {
  const form: ReactiveForm = { ...formOpts };

  const bind = <T extends any, PropName extends keyof T>(
    instance: T,
    propName: PropName,
    bindOpts?: ReactiveFormBindOptions,
  ) => control(form, instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

  const bindBoolean = <T extends any, PropName extends keyof T>(
    instance: T,
    propName: PropName,
    bindOpts?: ReactiveFormBindOptions,
  ) => control(form, instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

  const bindGroup = <T extends any, PropName extends keyof T>(
    instance: T,
    propName: PropName,
    bindOpts?: ReactiveFormBindOptions,
  ) => control(form, instance[propName], normalizeCtrlOptions(bindOpts, instance, propName));

  return {
    bind,
    bindBoolean,
    bindGroup,
    control: (value: any, ctrlOpts?: ReactiveFormControlOptions) => control(form, value, ctrlOpts),
    controlBoolean: (value: any, ctrlOpts?: ReactiveFormControlOptions) => control(form, value, ctrlOpts),
    controlGroup: (value: any, ctrlOpts?: ReactiveFormControlOptions) => controlGroup(form, value, ctrlOpts),
    form: () => form,
  };
};

const normalizeCtrlOptions = (bindOpts: ReactiveFormBindOptions, instance: any, propName: any) => {
  const ctrlOpts: ReactiveFormControlOptions = {
    ...bindOpts,
    onValueChange: (value) => (instance[propName] = value),
  };
  if (!isString(ctrlOpts.id)) {
    // if an "id" was provided let's create it from
    // the propName passed in, but convert it to
    // dash case which would be more common for html ids
    ctrlOpts.id = toDashCase(propName);
  }
  if (!isString(ctrlOpts.name)) {
    // if a "name" wasn't provided let's use the propName
    // but keep the propName's format
    ctrlOpts.name = propName;
  }
  return ctrlOpts;
};
