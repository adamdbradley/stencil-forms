export interface ReactiveForm extends ReactiveFormOptions {}

export interface ReactiveFormOptions {
  id?: string;
}

export type ReactiveFormValidateResults = string[] | string | undefined | null;

export interface ReactiveSubmit {}

export interface ReactiveFormControlOptions {
  debounceBlur?: number;
  debounceFocus?: number;
  debounceInput?: number;
  id?: string;
  name?: string;
  onBlur?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onDirty?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onEnter?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onEscape?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onFocus?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onInput?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onChange?: (value: any, validity: ValidityState, ev: UIEvent) => void;
  onInvalid?: (validity: ValidityState, ev: UIEvent) => void;
  onValid?: (validity: ValidityState, ev: UIEvent) => void;
  validate?: (value: any, ev: Event) => ReactiveFormValidateResults | Promise<ReactiveFormValidateResults>;
}

export interface ReactiveFormControl extends ReactiveFormControlOptions {}

export interface ReactiveFormControlGroup extends ReactiveFormControl {}

/** @internal */
export type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** @internal */
export type ControlProperties = {
  checked?: boolean;
  id?: string;
  max?: string;
  min?: string;
  name?: string;
  onBlur?: (ev: FocusEvent) => void;
  onClick?: (ev: Event) => void;
  onFocus?: (ev: FocusEvent) => void;
  onInput?: (ev: KeyboardEvent) => void;
  onInvalid?: (ev: Event) => void;
  ref?: (elm: ControlElement) => void;
  step?: string;
  type?: string;
  value?: string;
};
