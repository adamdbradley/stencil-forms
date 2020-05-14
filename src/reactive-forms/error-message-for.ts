import { ReactiveFormControl } from './utils/types';
import { getCtrlElmProps } from './utils/state';

export const errorMessageFor = (ctrl: ReactiveFormControl) => {
  const ctrlProps = getCtrlElmProps(ctrl);
  return {
    id: ctrlProps['aria-errormessage'] + ctrl.id + '-err-msg',
  };
};
