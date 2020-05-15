export interface ReactiveForm extends ReactiveFormOptions {}

export interface ReactiveFormOptions {
  id: string;
}

export type ReactiveFormValidateResults = string | undefined | null;

export interface ReactiveSubmit {}

export interface ReactiveFormBindOptions {
  changeEventName?: string;
  debounce?: number;
  id?: string;
  name?: string;
  onBlur?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onDirty?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onEnterKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onEscapeKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onFocus?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onInvalid?: (value: any, validity: ValidityState, ev: UIEvent) => void;
  onValid?: (value: any, validity: ValidityState, ev: UIEvent) => void;
  validate?: (value: any, ev: Event) => ReactiveFormValidateResults | Promise<ReactiveFormValidateResults>;
}

export type OnValueChange = (value: any, validity: ValidityState, ev: UIEvent) => void;

export interface ReactiveFormControlOptions extends ReactiveFormBindOptions {
  onValueChange?: OnValueChange;
}

export type ReactiveControlProperties = {
  checked?: boolean;
  htmlForm?: string;
  id?: string;
  name?: string;
  onBlur?: (ev: FocusEvent) => void;
  onClick?: (ev: Event) => void;
  onFocus?: (ev: FocusEvent) => void;
  onInput?: (ev: KeyboardEvent) => void;
  onInvalid?: (ev: Event) => void;
  ref?: (elm: ControlElement) => void;
  role?: string;
  value?: string;
};

export type ReactiveFormControl = () => ReactiveControlProperties;

/** @internal */
export type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
