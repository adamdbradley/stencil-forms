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
  onBlur?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onEnterKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onEscapeKey?: (value: any, validity: ValidityState, ev: KeyboardEvent) => void;
  onFocus?: (value: any, validity: ValidityState, ev: FocusEvent) => void;
  onInvalid?: (value: any, validity: ValidityState, ev: UIEvent) => void;
  validate?: (value: any, ev: Event) => ReactiveFormValidateResults | Promise<ReactiveFormValidateResults>;
  /**
   * The property name to use when assign the value to the input. The default
   * for `checkbox` and `radio` is `checked`, and the default for all others
   * is `value`.
   */
  valuePropName?: string;
  /**
   * The primitive type to cast the value property to and from. Default for a `bindBoolean`
   * input will be `boolean`. Default for `bindNumber` will be `number, and default for all
   * others will be a `string`.
   */
  valuePropType?: ReactiveFormValuePropType;
}

export interface ReactiveFormControlOptions extends ReactiveFormBindOptions {
  onValueChange?: (value: any, validity: ValidityState, ev: UIEvent) => void;
}

export interface ReactiveForm extends ReactiveFormOptions {}

export interface ReactiveFormOptions {
  id: string;
}

export type ReactiveFormValuePropType = 'string' | 'boolean' | 'number';

export type ReactiveFormValidateResults = string | undefined | null;

export interface ReactiveSubmit {}

export type ReactiveFormControl = () => ReactiveControlProperties;

export type ReactiveFormControlGroup = (groupItemId?: string, groupItemValue?: string) => ReactiveControlProperties;

/** @internal */
export interface ControlData extends ReactiveFormControlOptions {
  /**
   * Unique "id" which may change after the control element renders
   * and the user's control element has provided its own "id"
   */
  id?: string;

  /**
   * "name" which may change after the control element renders
   * and the user's control element has provided its own "name"
   */
  name?: string;

  /**
   * once this gets set it should not change
   */
  groupName?: string;
}

/** @internal */
export type ReactiveControlProperties = {
  checked?: boolean;
  // id: string;
  // name?: string;
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
