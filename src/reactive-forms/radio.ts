import { ReactiveFormControlGroup } from './utils/types';
import { getCtrlElmProps, ctrlValueMap } from './utils/state';
import { isString } from './utils/helpers';

export const radioGroup = (formCtrlGroup: ReactiveFormControlGroup) => {
  formCtrlGroup.ctrls.forEach((formCtrl) => {
    const ctrlProps = getCtrlElmProps(formCtrl);
    ctrlProps.groupValue = String(groupValue);
    ctrlProps.checked = ctrlProps.groupValue === ctrlProps.value;
  });

  return {
    role: 'radiogroup',
  };
};

export const radio = (ctrlGroup: ReactiveFormControlGroup, id: string, radioInputValue?: string) => {
  const ctrl = groupCtrls.get(id);
  const props = getCtrlElmProps(ctrl);

  props.type = 'radio';

  // individual radios require a unique "id"
  props.id = id;

  // all radios in the group should have the same "name"
  // which comes from the control group name if it's set, otherwise the group id
  props.name = isString(ctrlGroup.name) ? ctrlGroup.name : ctrlGroup.id;

  // individual radios should each have a unique "value" assigned
  // use the optional "radioInputValue" first, otherwise use the unique "id"
  props.value = isString(radioInputValue) ? radioInputValue : id;

  // this radio is checked if its value is the same as the radio group's value
  const groupValue = ctrlValueMap.get(ctrlGroup);
  props.checked = groupValue != null ? String(groupValue) === String(props.value) : false;

  return props;
};
