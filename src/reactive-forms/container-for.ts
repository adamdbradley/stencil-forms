import { ctrlGroupsElmAttrsMap, ctrlElmAttrsMap } from './utils/state';
import { isString } from './utils/helpers';
import type { ReactiveFormControl } from './utils/types';

const labellingFor = (
  ctrl: ReactiveFormControl,
  attrName: string,
  labellingIdSuffix: string,
  groupItemValue: string,
) => {
  const ctrlId = ctrl().id;
  const ctrlGroupElmAttrsMap = ctrlGroupsElmAttrsMap.get(ctrl);
  const ctrlElmAttrs = ctrlElmAttrsMap.get(ctrl);

  // props object for the labelling element
  const labellingProps: any = {};

  if (ctrlGroupElmAttrsMap) {
    // this ctrl is a control group
    if (isString(groupItemValue)) {
      // labelling element for a group item input
      const groupItemId = ctrlId + '-' + groupItemValue;

      let ctrlGroupElmAttrs = ctrlGroupElmAttrsMap.get(groupItemId);
      if (!ctrlGroupElmAttrs) {
        ctrlGroupElmAttrsMap.set(groupItemId, (ctrlGroupElmAttrs = new Map()));
      }

      ctrlGroupElmAttrs.set(attrName, (labellingProps.id = groupItemId + labellingIdSuffix));
      setLabellingElmAttr(labellingProps, attrName, groupItemId);
    } else {
      // labelling element for the wrapping group
      ctrlElmAttrs.set(attrName, (labellingProps.id = ctrlId + labellingIdSuffix));
    }
  } else {
    // labelling element for a normal control
    ctrlElmAttrs.set(attrName, (labellingProps.id = ctrlId + labellingIdSuffix));
    setLabellingElmAttr(labellingProps, attrName, ctrlId);
  }

  // return props for the container element
  return labellingProps;
};

const setLabellingElmAttr = (props: any, attrName: string, attrValue: string) => {
  if (attrName === 'aria-labelledby') {
    props.ref = (elm: HTMLElement) => {
      if (elm.nodeName === 'LABEL') {
        elm.setAttribute('for', attrValue);
      }
    };
  }
};

export const descriptionFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, 'aria-describedby', '-desc', groupItemValue);

export const validationFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, 'aria-errormessage', '-err', groupItemValue);

export const labelFor = (ctrl: ReactiveFormControl, groupItemValue?: string) =>
  labellingFor(ctrl, 'aria-labelledby', '-lbl', groupItemValue);
