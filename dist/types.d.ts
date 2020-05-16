export interface ReactiveForm extends ReactiveFormOptions {
}
export interface ReactiveFormOptions {
    id: string;
}
export declare type ReactiveFormValidateResults = string | undefined | null;
export interface ReactiveSubmit {
}
export interface ReactiveFormBindOptions {
    changeEventName?: string;
    debounce?: number;
    id?: string;
    name?: string;
    onBlur?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
    onEnterKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
    onEscapeKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
    onFocus?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
    onInvalid?: (value: any, validity: ValidityState, ev: UIEvent) => void;
    validate?: (value: any, ev: Event) => ReactiveFormValidateResults | Promise<ReactiveFormValidateResults>;
}
export interface ReactiveFormControlOptions extends ReactiveFormBindOptions {
    id: string;
    onValueChange?: (value: any, validity: ValidityState, ev: UIEvent) => void;
}
export declare type ReactiveControlProperties = {
    checked?: boolean;
    htmlForm?: string;
    id: string;
    name?: string;
    onBlur?: (ev: FocusEvent) => void;
    onChange?: (ev: Event) => void;
    onClick?: (ev: Event) => void;
    onFocus?: (ev: FocusEvent) => void;
    onInput?: (ev: KeyboardEvent) => void;
    onInvalid?: (ev: Event) => void;
    ref?: (elm: ControlElement) => void;
    role?: string;
    value?: string;
};
export declare type ReactiveFormControl = () => ReactiveControlProperties;
export declare type ReactiveFormControlGroup = (groupItemId?: string, groupItemValue?: string) => ReactiveControlProperties;
/** @internal */
export declare type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
