import type { ReactiveFormControl, ControlElement, ReactiveFormControlOptions, ReactiveForm } from './types';

export const formCtrlIdsMap = new WeakMap<ReactiveForm, number>();

export const formCtrlMap = new WeakMap<ControlElement, ReactiveFormControl>();

export const ctrlElmMap = new WeakMap<ReactiveFormControl, ControlElement>();

export const controlOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlBooleanOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlGroupOptsMap = new WeakMap<ReactiveFormControl, ReactiveFormControlOptions>();

export const controlGroupValueMap = new WeakMap<ReactiveFormControl, any>();

export const inputEvDebounceMap = new WeakMap<ControlElement, any>();
