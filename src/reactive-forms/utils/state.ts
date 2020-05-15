import type { ReactiveFormControl, ControlElement, ReactiveFormControlOptions, ReactiveForm } from './types';

export const ctrlIdsMap = new WeakMap<ReactiveForm, number>();

export const ctrlMap = new WeakMap<ControlElement, ReactiveFormControl>();

export const ctrlElmAttrsMap = new WeakMap<ReactiveFormControl, Map<string, string>>();

export const controlOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlBooleanOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlGroupOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlGroupValueMap = new WeakMap<ReactiveFormControl, any>();

export const inputEvDebounceMap = new WeakMap<ControlElement, any>();
