import { ctrlChildren, ctrlElms, ctrlDatas, labellingElms, LabellingType, state } from './utils/state';
import { isString, setAttribute } from './utils/helpers';
import { ReactiveFormControl, ControlElement } from './types';

const labellingFor = (
  ctrl: ReactiveFormControl,
  groupItemValue: string,
  labellingType: LabellingType,
  setAttrs: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void,
) => {
  state.r = null;

  if (isString(groupItemValue)) {
    // labelling element for a group item input
    return {
      ref: (groupItemLabellingElm: HTMLElement) => {
        if (groupItemLabellingElm) {
          const child = getGroupChild(ctrl, groupItemValue);
          const ctrlElm = ctrlElms.get(child.ctrl);
          if (ctrlElm) {
            // we already have the control element, so that means we'll
            // have the "id" and "name" data to when setting the attrs
            setAttrs(child.data.i, ctrlElm, groupItemLabellingElm);
          } else {
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
    ref: (labellingElm: HTMLElement) => {
      if (labellingElm) {
        // we now have the labelling element, which could happen before or
        // after having the control input element
        const ctrlElm = ctrlElms.get(ctrl);
        if (ctrlElm) {
          // we already have the control element, so that means we'll
          // have the "id" and "name" data to when setting the attrs
          setAttrs(ctrlDatas.get(ctrl).i, ctrlElm, labellingElm);
        } else {
          // we haven't gotten a reference to the control element yet
          // so let's remember this labelling element for now and will
          // add the attribute later once we get a ref to the control element
          labellingElms[labellingType].set(ctrl, labellingElm);
        }
      }
    },
  };
};

export const setDescribedbyAttributes = (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) =>
  setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'describedby', 'desc');

export const setErrormessageAttributes = (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) =>
  setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'errormessage', 'err');

export const setLabelledbyAttributes = (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => {
  if (labellingElm) {
    if (labellingElm.nodeName === 'LABEL') {
      // labelling element is an actual <label> so we can use the "for" attribute
      setAttribute(labellingElm, 'for', ctrlId);
    } else {
      // labelling element is not a <label> so let's use "aria-labelledby" instead
      setAriaLinkedIdAttributes(ctrlId, ctrlElm, labellingElm, 'labelledby', 'lbl');
    }
  }
};

const setAriaLinkedIdAttributes = (
  ctrlId: string,
  ctrlElm: ControlElement,
  labellingElm: HTMLElement,
  ariaAttr: string,
  labellingIdSuffix: string,
) => setAttribute(ctrlElm, 'aria-' + ariaAttr, setAttribute(labellingElm, 'id', ctrlId + '-' + labellingIdSuffix));

export const descriptionFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, groupItemValue, LabellingType.describedby, setDescribedbyAttributes);

export const validationFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, groupItemValue, LabellingType.errormessage, setErrormessageAttributes);

export const labelFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, groupItemValue, LabellingType.labelledby, setLabelledbyAttributes);

export const getGroupChild = (parentCtrl: ReactiveFormControl, groupItemValue: string) => {
  const ctrlChildMap = ctrlChildren.get(parentCtrl);
  let child = ctrlChildMap.get(groupItemValue);
  if (!child) {
    const parentCtrlData = ctrlDatas.get(parentCtrl);
    if (!parentCtrlData.g) {
      parentCtrlData.g = parentCtrlData.n;
    }
    ctrlChildMap.set(
      groupItemValue,
      (child = {
        ctrl: {} as any,
        data: {
          valuePropName: 'value',
          valuePropType: 'string',
          i: parentCtrlData.g + '-' + groupItemValue,
          n: parentCtrlData.g,
          onValueChange: parentCtrlData.onValueChange,
        },
      }),
    );
    ctrlDatas.set(child.ctrl, child.data);
  }
  return child;
};
