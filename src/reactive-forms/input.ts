import { controlGroupOptsMap, controlGroupValueMap } from './utils/state';
import { isString } from './utils/helpers';
import type { ReactiveFormControl, ReactiveControlProperties } from './utils/types';

export const input = (ctrl: ReactiveFormControl, groupItemValue?: string) => {
  const groupOpts = controlGroupOptsMap.get(ctrl);
  if (groupOpts && isString(groupItemValue)) {
    // grouped control input item, like <input type="radio">
    // a group only has one "value" and the individual radio that has
    // the same value as the group value is the "checked" radio
    const groupValue = controlGroupValueMap.get(ctrl);

    const props: ReactiveControlProperties = {
      // all radios in the group should have the same "name"
      // which comes from the control group "name" if it's set, otherwise the group "id"
      name: isString(groupOpts.name) ? groupOpts.name : groupOpts.id,

      // individual radios require a unique "id"
      // the "groupItemValue" should already be unique, so that'll work
      id: groupOpts.id + '-' + groupItemValue,

      // individual radio should each have a unique "value" assigned
      value: groupItemValue,

      // this radio is "checked" if its value is the same as the radio group's value
      checked: groupValue != null ? String(groupValue) === String(groupItemValue) : false,
    };

    return props;
  }

  // normal input, not a grouped input, so its props have already been set
  return ctrl();
};
