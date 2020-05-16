import { ReactiveFormBindOptions } from './types';
export declare const bind: <T extends unknown, PropName extends keyof T>(instance: T, propName: PropName, bindOpts?: ReactiveFormBindOptions) => import("./types").ReactiveFormControl;
export declare const bindBoolean: <T extends unknown, PropName extends keyof T>(instance: T, propName: PropName, bindOpts?: ReactiveFormBindOptions) => import("./types").ReactiveFormControl;
export declare const bindGroup: <T extends unknown, PropName extends keyof T>(instance: T, propName: PropName, bindOpts?: ReactiveFormBindOptions) => import("./types").ReactiveFormControlGroup;
