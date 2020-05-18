import { ctrlChildrenMap, ctrlElmsMap, ctrlDataMap, labellingElmsMap, LabellingType } from './utils/state';
import { isString, setAttribute } from './utils/helpers';
import { ReactiveFormControl, ControlElement } from './types';

const labellingFor = (
  ctrl: ReactiveFormControl,
  groupItemValue: string,
  labellingType: LabellingType,
  setAttrs: (ctrlId: string, ctrlElm: ControlElement, labellingElm: HTMLElement) => void,
) => {
  if (isString(groupItemValue)) {
    // labelling element for a group item input
    return {
      ref: (groupItemLabellingElm: HTMLElement) => {
        if (groupItemLabellingElm) {
          const child = getGroupChild(ctrl, groupItemValue);
          const ctrlElm = ctrlElmsMap.get(child.ctrl);
          if (ctrlElm) {
            // we already have the control element, so that means we'll
            // have the "id" and "name" data to when setting the attrs
            setAttrs(child.data.id, ctrlElm, groupItemLabellingElm);
          } else {
            // we haven't gotten a reference to the control element yet
            // so let's remember this labelling element for now and will
            // add the attribute later once we get a ref to the control element
            labellingElmsMap[labellingType].set(child.ctrl, groupItemLabellingElm);
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
        const ctrlElm = ctrlElmsMap.get(ctrl);
        if (ctrlElm) {
          // we already have the control element, so that means we'll
          // have the "id" and "name" data to when setting the attrs
          setAttrs(ctrlDataMap.get(ctrl).id, ctrlElm, labellingElm);
        } else {
          // we haven't gotten a reference to the control element yet
          // so let's remember this labelling element for now and will
          // add the attribute later once we get a ref to the control element
          labellingElmsMap[labellingType].set(ctrl, labellingElm);
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
  const ctrlChildMap = ctrlChildrenMap.get(parentCtrl);
  let child = ctrlChildMap.get(groupItemValue);
  if (!child) {
    const parentCtrlData = ctrlDataMap.get(parentCtrl);
    if (!parentCtrlData.groupName) {
      parentCtrlData.groupName = parentCtrlData.name;
    }
    ctrlChildMap.set(
      groupItemValue,
      (child = {
        ctrl: {} as any,
        data: {
          valuePropName: 'value',
          valuePropType: 'string',
          id: parentCtrlData.groupName + '-' + groupItemValue,
          name: parentCtrlData.groupName,
          onValueChange: parentCtrlData.onValueChange,
        },
      }),
    );
    ctrlDataMap.set(child.ctrl, child.data);
  }
  return child;
};
