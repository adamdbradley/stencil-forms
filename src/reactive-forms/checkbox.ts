import { getCtrlElmProps, ctrlValueMap } from './utils/state';
import { ReactiveFormControl } from './utils/types';

export const checkbox = (ctrl: ReactiveFormControl) => {
  const props = getCtrlElmProps(ctrl);

  props.type = 'checkbox';

  // value has already be set as a string
  // use this to decide if it
  props.checked = !!ctrlValueMap.get(ctrl);

  return props;
};
