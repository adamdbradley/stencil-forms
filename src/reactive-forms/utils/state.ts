import type {
  ReactiveFormControl,
  ControlElement,
  ReactiveFormControlOptions,
  ReactiveFormControlGroup,
} from './types';

export const ctrlMap = new WeakMap<ControlElement, ReactiveFormControl | ReactiveFormControlGroup>();

export const ctrlElmAttrsMap = new WeakMap<ReactiveFormControl | ReactiveFormControlGroup, Map<string, string>>();

export const ctrlGroupItemsMap = new WeakMap<ReactiveFormControl | ReactiveFormControl>();

export const ctrlOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const ctrlBooleanOptsMap = new WeakMap<
  ReactiveFormControl | ReactiveFormControlGroup,
  ReactiveFormControlOptions
>();

export const ctrlGroupsElmAttrsMap = new WeakMap<
  ReactiveFormControl | ReactiveFormControlGroup,
  Map<string, Map<string, string>>
>();

export const inputEvDebounceMap = new WeakMap<ControlElement, any>();
