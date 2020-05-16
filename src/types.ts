export interface ReactiveFormBindOptions {
  /**
   * The JSX event name property used to listen for input changes.
   * Defaults to `onInput` for text inputs, and `onChange` for
   * `checkbox` and `radio`. This can be used to bind to custom
   * event names, such as `ionOnChange`.
   */
  changeEventName?: string;
  /**
   * Number of milliseconds to debounce the value change event.
   * By default there is no debounce.
   */
  debounce?: number;
  /**
   * The "id" attribute/property to use for the input element.
   * By default the id is created from the property name passed
   * into the bind function.
   */
  id?: string;
  /**
   * The "name" attribute/property to use for the input element.
   * By default the name is created from the property name passed
   * into the bind function.
   */
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

export interface ReactiveForm extends ReactiveFormOptions {}

export interface ReactiveFormOptions {
  id: string;
}

export type ReactiveFormValidateResults = string | undefined | null;

export interface ReactiveSubmit {}

export type ReactiveFormControl = () => ReactiveControlProperties;

export type ReactiveFormControlGroup = (groupItemId?: string, groupItemValue?: string) => ReactiveControlProperties;

/** @internal */
export type ReactiveControlProperties = {
  checked?: boolean;
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

/** @internal */
export type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
