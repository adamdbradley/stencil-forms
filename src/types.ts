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
   * The `onBlur()` hook is trigged when the control actively had focus,
   * but was just lost focus. Trigged from the native `blur` event.
   */
  onBlur?: (data: { value: any; validity: ValidityState; ev: FocusEvent; elm: ControlElement }) => void;
  /**
   * The `onCommit()` hook is trigged when either an "Enter" `keyup` event,
   * or a `blur` event has occurred. It's a combination of `onEnterKey()`
   * and `onBlur()`, and could be used to run the same logic for both
   * hooks.
   */
  onCommit?: (data: {
    value: any;
    validity: ValidityState;
    ev: FocusEvent | KeyboardEvent;
    elm: ControlElement;
  }) => void;
  /**
   * The `onEnterKey()` hook is trigged on a native `keyup` event with the
   * "Enter" key. However, the `onCommit()` hook may also be useful
   * to run logic when the control receives either an "Enter" `keyup`
   * event or `blur` event.
   */
  onEnterKey?: (data: { value: any; validity: ValidityState; ev: KeyboardEvent; elm: ControlElement }) => void;
  /**
   * The `onEscapeKey()` hook is trigged on a native `keyup` event with the
   * "Escape" key. By default, when the Escape key `keyup` event is fired,
   * the value of the control will be reset back to the initial value when
   * the control first received focus. Set the `resetOnEscape` option to
   * `false` to disable resetting the value back to the initial value.
   */
  onEscapeKey?: (data: {
    value: any;
    validity: ValidityState;
    initialValue: any;
    ev: KeyboardEvent;
    elm: ControlElement;
  }) => void;
  /**
   * The `onFocus()` hook is trigged when the control received focus.
   * Trigged from the native `focus` event.
   */
  onFocus?: (data: { value: any; validity: ValidityState; ev: FocusEvent; elm: ControlElement }) => void;
  onInvalid?: (data: { value: any; validity: ValidityState; ev: Event; elm: ControlElement }) => void;
  /**
   * The `onKeyDown()` hook is trigged from the native `keydown` event.
   * The first argument is the key that was pressed.
   */
  onKeyDown?: (data: { key: string; value: any; ev: KeyboardEvent; elm: ControlElement }) => void;
  /**
   * The `onKeyUp()` hook is trigged from the native `keyup` event.
   * The first argument is the key that was pressed. If listening for
   * the "Enter" or "Escape" key, the `onEnterKey()` and `onEscapeKey()`
   * hooks are also available for convenience.
   */
  onKeyUp?: (data: { key: string; value: any; ev: KeyboardEvent; elm: ControlElement }) => void;
  /**
   * The `onTouch()` hook is only called the first time the form
   * control received the native `focus` event. This hook is not trigged
   * against on subsequent focus events
   */
  onTouch?: (data: { value: any; validity: ValidityState; ev: FocusEvent; elm: ControlElement }) => void;
  /**
   * By default, if the "Escape" key is pressed, then the value will be reset back
   * to the initial value at the time when the control was focused. Set this option
   * to `false` to disable resetting the value back to the initial value.
   */
  resetOnEscape?: boolean;
  validate?: (data: {
    value: any;
    validity: ValidityState;
    ev: Event | null;
    elm: ControlElement;
  }) => ReactiveValidateResult | Promise<ReactiveValidateResult>;
  activelyValidatingMessage?: string | ((value: any, ev: Event | null) => string);
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
  onValueChange?: (data: { value: any; validity: ValidityState; ev: Event; elm: ControlElement }) => void;
}

export type ReactiveFormValuePropType = 'string' | 'boolean' | 'number';

export type ReactiveValidateResult = string | undefined | null | void;

export type ReactiveFormControl = () => ReactiveControlProperties;

export type ReactiveFormControlGroup = (groupItemId?: string, groupItemValue?: string) => ReactiveControlProperties;

/** @internal */
export interface ControlData extends ReactiveFormControlOptions {
  /**
   * Unique "id" which may change after the control element renders
   * and the user's control element has provided its own "id"
   */
  i?: string;

  /**
   * Name: "name" which may change after the control element renders
   * and the user's control element has provided its own "name"
   */
  n?: string;

  /**
   * Group Name: once this gets set it should not change
   */
  g?: string;

  /**
   * Control Index: This is the index in the order of all the
   * controls that were created at the beginning of render()
   */
  x?: number;
}

/** @internal */
export interface ControlState {
  /**
   * Is first load
   */
  i: boolean;
  /**
   * Is Dirty
   */
  d: boolean;
  /**
   * Is Touched
   */
  t: boolean;
  /**
   * The message while actively validating
   */
  m: string;
  /**
   * The validation error message
   */
  e: string;
  /**
   * Most recent async callback id. Used so that we can
   * ignore older async callbacks.
   */
  c: number;
  /**
   * Initial value when the control received focus.
   */
  v: any;
}

export type ReactiveControlProperties = {
  checked?: boolean;
  onBlur?: (ev: any) => void;
  onChange?: (ev: any) => void;
  onClick?: (ev: any) => void;
  onFocus?: (ev: any) => void;
  onInput?: (ev: any) => void;
  onKeyDown?: (ev: any) => void;
  onKeyUp?: (ev: any) => void;
  onInvalid?: (ev: any) => void;
  ref?: (elm: any) => void;
  role?: string;
  value?: string;
};

export type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
