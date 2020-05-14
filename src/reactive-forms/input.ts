import { getCtrlElmProps } from './utils/state';
import { ReactiveFormControl } from './utils/types';

const input = (ctrl: ReactiveFormControl, type: string) => {
  const props = getCtrlElmProps(ctrl);
  props.type = type;
  return props;
};

export const text = (ctrl: ReactiveFormControl) => input(ctrl, 'text');

export const email = (ctrl: ReactiveFormControl) => input(ctrl, 'email');
