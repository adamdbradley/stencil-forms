import { ctrlChildren, ctrlElms, ctrlDatas, labellingElms, state } from './state';
import { isString, setAttribute } from './helpers';
const labellingFor = (ctrl, groupItemValue, labellingType, setAttrs) => {
    state.r = null;
    if (isString(groupItemValue)) {
        // labelling element for a group item input
        return {
            ref: (groupItemLabellingElm) => {
                if (groupItemLabellingElm) {
                    const child = getGroupChild(ctrl, groupItemValue);
                    const ctrlElm = ctrlElms.get(child.ctrl);
                    if (ctrlElm) {
                        // we already have the control element, so that means we'll
                        // have the "id" and "name" data to when setting the attrs
                        setAttrs(child.data.i, ctrlElm, groupItemLabellingElm);
                    }
                    else {
                        // we haven't gotten a reference to the control element yet
                        // so let's remember this labelling element for now and will
                        // add the attribute later once we get a ref to the control element
                        labellingElms[labellingType].set(child.ctrl, groupItemLabellingElm);
                    }
                }
            },
        };
    }
    // labelling element for a normal control
    // or labelling element for the wrapping group
    return {
        ref: (labellingElm) => {
            var _a;
            if (labellingElm) {
                // we now have the labelling element, which could happen before or
                // after having the control input element
                const ctrlElm = ctrlElms.get(ctrl);
                if (ctrlElm) {
                    // we already have the control element, so that means we'll
                    // have the "id" and "name" data to when setting the attrs
                    setAttrs((_a = ctrlDatas.get(ctrl)) === null || _a === void 0 ? void 0 : _a.i, ctrlElm, labellingElm);
                }
                else {
                    // we haven't gotten a reference to the control element yet
                    // so let's remember this labelling element for now and will
                    // add the attribute later once we get a ref to the control element
                    labellingElms[labellingType].set(ctrl, labellingElm);
                }
            }
        },
    };
};
export const setDescribedbyAttributes = (ctrlId, ctrlElm, labellingElm) => setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'describedby', 'desc');
export const setErrormessageAttributes = (ctrlId, ctrlElm, labellingElm) => {
    setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'errormessage', 'err');
    setAttribute(labellingElm, 'role', 'alert');
    setAttribute(labellingElm, 'aria-atomic', 'true');
    setAttribute(ctrlElm, 'formnovalidate');
};
export const setLabelledbyAttributes = (ctrlId, ctrlElm, labellingElm) => {
    if (labellingElm) {
        if (labellingElm.nodeName === 'LABEL') {
            // labelling element is an actual <label> so we can use the "for" attribute
            setAttribute(labellingElm, 'for', ctrlId);
        }
        else {
            // labelling element is not a <label> so let's use "aria-labelledby" instead
            setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'labelledby', 'lbl');
        }
    }
};
const setAriaLinkedIdAttributes = (ctrlId, ctrlElm, labellingElm, ariaAttr, labellingIdSuffix) => setAttribute(ctrlElm, 'aria-' + ariaAttr, setAttribute(labellingElm, 'id', ctrlId + '-' + labellingIdSuffix));
/**
 * The `descriptionFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that described it. This is very similar to
 * label, but the description provides more information that the user might need.
 * When using this method, the element it's attached to will automatically link
 * up the description by adding the `aria-describedby` attribute to the control
 * element, and a unique id to the description element.
 */
export const descriptionFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 2 /* describedby */, setDescribedbyAttributes);
/**
 * The `validationFor(ctrl)` method is used to establish a relationship between
 * an input control and it's error message. When using this method, the element
 * it's attached to will automatically link up the error by adding the
 * `aria-errormessage` attribute to the control element, and a unique id to the
 * message element. Additionally, it will add `role="alert"` and `aria-atomic="true"`
 * to the message element.
 */
export const validationFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 1 /* errormessage */, setErrormessageAttributes);
/**
 * The `labelFor(ctrl)` method is used to establish a relationship between
 * an input control and this text that labels it. When the labelling element is
 * an actual `<label>`, it will add the `for` attribute to the label, pointing
 * it to the correct control id. When the labelling element is not a `<label>`
 * it will then use `aria-labelledby`.
 */
export const labelFor = (ctrl, groupItemValue) => labellingFor(ctrl, groupItemValue, 0 /* labelledby */, setLabelledbyAttributes);
export const getGroupChild = (parentCtrl, groupItemValue) => {
    const ctrlChildMap = ctrlChildren.get(parentCtrl);
    if (!ctrlChildMap) {
        return;
    }
    let child = ctrlChildMap.get(groupItemValue);
    if (!child) {
        const parentCtrlData = ctrlDatas.get(parentCtrl);
        if (!parentCtrlData.g) {
            parentCtrlData.g = parentCtrlData.n;
        }
        ctrlChildMap.set(groupItemValue, (child = {
            ctrl: {},
            data: {
                valuePropName: 'value',
                valuePropType: 'string',
                i: parentCtrlData.g + '-' + groupItemValue,
                n: parentCtrlData.g,
                onValueChange: parentCtrlData.onValueChange,
            },
        }));
        ctrlDatas.set(child.ctrl, child.data);
    }
    return child;
};
