import { ctrlElmAttrsMap, ctrlGroupsElmAttrsMap } from './utils/state';
import { isString } from './utils/helpers';
const labellingFor = (ctrl, attrName, labellingIdSuffix, groupItemValue) => {
    const ctrlId = ctrl().id;
    const ctrlGroupElmAttrsMap = ctrlGroupsElmAttrsMap.get(ctrl);
    const ctrlElmAttrs = ctrlElmAttrsMap.get(ctrl);
    // props object for the labelling element
    const labellingProps = {};
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
        }
        else {
            // labelling element for the wrapping group
            ctrlElmAttrs.set(attrName, (labellingProps.id = ctrlId + labellingIdSuffix));
        }
    }
    else {
        // labelling element for a normal control
        ctrlElmAttrs.set(attrName, (labellingProps.id = ctrlId + labellingIdSuffix));
        setLabellingElmAttr(labellingProps, attrName, ctrlId);
    }
    // return props for the container element
    return labellingProps;
};
const setLabellingElmAttr = (props, attrName, attrValue) => {
    if (attrName === 'aria-labelledby') {
        props.ref = (elm) => {
            if (elm.nodeName === 'LABEL') {
                elm.setAttribute('for', attrValue);
            }
        };
    }
};
export const descriptionFor = (ctrl, groupItemValue) => labellingFor(ctrl, 'aria-describedby', '-desc', groupItemValue);
export const validationFor = (ctrl, groupItemValue) => labellingFor(ctrl, 'aria-errormessage', '-err', groupItemValue);
export const labelFor = (ctrl, groupItemValue) => labellingFor(ctrl, 'aria-labelledby', '-lbl', groupItemValue);
