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
  onBlur?: (event: ReactiveFormEvent) => void;
  /**
   * The `onCommit()` hook is trigged when:
   * - The "Enter" key was pressed from a `keyup` event (but not for `<textarea>`)
   * - The `change` event has fired for the control. Note that the `change`
   *   event is fired when an text input looses focus and the value
   *   has changed, or when the value has changed for a radio or select control.
   */
  onCommit?: (event: ReactiveFormEvent) => void;
  /**
   * The `onEnterKey()` hook is trigged on a native `keyup` event with the
   * "Enter" key, and the control element is not a `<textarea>`.
   * However, the `onCommit()` hook may also be useful to run logic when the
   * control receives either an "Enter" `keyup` event or `blur` event.
   */
  onEnterKey?: (event: ReactiveFormEvent) => void;
  /**
   * The `onEscapeKey()` hook is trigged on a native `keyup` event with the
   * "Escape" key. By default, when the Escape key `keyup` event is fired,
   * the value of the control will be reset back to the initial value when
   * the control first received focus. Set the `resetOnEscape` option to
   * `false` to disable resetting the value back to the initial value.
   */
  onEscapeKey?: (event: ReactiveFormEvent) => void;
  /**
   * The `onFocus()` hook is trigged when the control received focus.
   * Trigged from the native `focus` event.
   */
  onFocus?: (event: ReactiveFormEvent) => void;
  onInvalid?: (event: ReactiveFormEvent) => void;
  /**
   * The `onKeyDown()` hook is trigged from the native `keydown` event.
   * The first argument is the key that was pressed.
   */
  onKeyDown?: (event: ReactiveFormEvent) => void;
  /**
   * The `onKeyUp()` hook is trigged from the native `keyup` event.
   * The first argument is the key that was pressed. If listening for
   * the "Enter" or "Escape" key, the `onEnterKey()` and `onEscapeKey()`
   * hooks are also available for convenience.
   */
  onKeyUp?: (event: ReactiveFormEvent) => void;
  /**
   * The `onTouch()` hook is only called the first time the form
   * control received the native `focus` event. This hook is not trigged
   * against on subsequent focus events
   */
  onTouch?: (event: ReactiveFormEvent) => void;
  /**
   * By default, if the "Escape" key is pressed, then the value will be reset back
   * to the initial value at the time when the control was focused. Set this option
   * to `false` to disable resetting the value back to the initial value.
   */
  resetOnEscape?: boolean;
  validate?: (event: ReactiveFormEvent) => ReactiveValidateResult | Promise<ReactiveValidateResult>;
  activelyValidatingMessage?: string | ((event: ReactiveFormEvent) => string);
  /**
   * The property name to use when assign the value to the input. The default
   * for `checkbox` and `radio` is `checked`, and the default for all others
   * is `value`.
   */
  valuePropName?: string;
  /**
   * The primitive type to cast the value property to and from. Default for a `bindChecked`
   * input will be `boolean`. Default for `bindNumber` will be `number, and default for all
   * others will be a `string`.
   */
  valuePropType?: ReactiveFormValuePropType;
}

export interface ReactiveFormControlOptions extends ReactiveFormBindOptions {
  onValueChange?: (event: ReactiveFormEvent) => void;
}

export interface ReactiveFormEvent {
  /**
   * The current value of the control.
   */
  value?: any;
  /**
   * The initial value when the control was first focused. If a control
   * looses focus, then gains focus again, the "initialValue" will be
   * reset again from what its current value is.
   */
  initialValue?: any;
  /**
   * The "validity" states that a control can be in, with respect
   * to constraint validation. Together, they help explain why an
   * element's value fails to validate, if it's not valid.
   * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
   */
  validity?: ValidityState;
  /**
   * The event type, such as "keyup", "focus", "blur", "input", etc.
   */
  type?: string;
  /**
   * The key that was press if it was a "keydown" or "keyup" event. The
   * enter and escape keys use "Enter" and "Escape" respectively. If the
   * event type was not a KeyboardEvent then this value will be undefined.
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   */
  key?: string;
  /**
   * The native event that was dispatched. Depending on the event, it could
   * be KeyboardEvent, FocusEvent or InputEvent.
   */
  ev?: Event;
  /**
   * The control element, such as the `<input>`, `<textarea>` or `<select>`,
   * from where the event was dispatched from.
   */
  ctrl?: ControlElement;
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
  f: boolean;
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
  i: any;
  /**
   * Last value used to check validity.
   */
  l: any;
  /**
   * Last value used to call onValueChange
   */
  g: any;
  /**
   * Last value used to call onCommit
   */
  n: any;
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
