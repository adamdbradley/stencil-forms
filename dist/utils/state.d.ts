import { ControlElement, ReactiveFormControl, ReactiveFormControlOptions, ReactiveFormControlGroup } from '../types';
export declare const ctrlBooleanOptsMap: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, ReactiveFormControlOptions>;
export declare const ctrlElmAttrsMap: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, Map<string, string>>;
export declare const ctrlGroupsElmAttrsMap: WeakMap<ReactiveFormControl | ReactiveFormControlGroup, Map<string, Map<string, string>>>;
export declare const ctrlGroupItemsMap: WeakMap<ReactiveFormControl, any>;
export declare const ctrlMap: WeakMap<ControlElement, ReactiveFormControl | ReactiveFormControlGroup>;
export declare const ctrlOptsMap: WeakMap<ReactiveFormControl, ReactiveFormControlOptions>;
export declare const inputEvDebounceMap: WeakMap<ControlElement, any>;
