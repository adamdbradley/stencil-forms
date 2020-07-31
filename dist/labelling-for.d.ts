import type { ReactiveFormControl, ControlElement } from './types';
export declare const setDescribedbyAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => string;
export declare const setErrormessageAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void;
export declare const setLabelledbyAttributes: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void;
/**
 * The `descriptionFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that described it. This is very similar to
 * label, but the description provides more information that the user might need.
 * When using this method, the element it's attached to will automatically link
 * up the description by adding the `aria-describedby` attribute to the control
 * element, and a unique id to the description element.
 */
export declare const descriptionFor: (ctrl: ReactiveFormControl, groupItemValue?: string | undefined) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
/**
 * The `validationFor(ctrl)` method is used to establish a relationship between
 * an input control and it's error message. When using this method, the element
 * it's attached to will automatically link up the error by adding the
 * `aria-errormessage` attribute to the control element, and a unique id to the
 * message element. Additionally, it will add `role="alert"` and `aria-atomic="true"`
 * to the message element.
 */
export declare const validationFor: (ctrl: ReactiveFormControl, groupItemValue?: string | undefined) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
/**
 * The `labelFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that labels it. When the labelling element is
 * an actual `<label>`, it will add the `for` attribute to the label, pointing
 * it to the correct control id. When the labelling element is not a `<label>`
 * it will then use `aria-labelledby`.
 */
export declare const labelFor: (ctrl: ReactiveFormControl, groupItemValue?: string | undefined) => {
    ref: (groupItemLabellingElm: HTMLElement) => void;
};
export declare const getGroupChild: (parentCtrl: ReactiveFormControl, groupItemValue: string) => {
    ctrl: ReactiveFormControl;
    data: import("./types").ControlData;
} | undefined;
