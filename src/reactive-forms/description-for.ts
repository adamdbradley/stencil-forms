import { ReactiveFormControl } from './utils/types';
import { getCtrlElmProps } from './utils/state';

export const descriptionFor = (formCtrl: ReactiveFormControl) => {
  const ctrlProps = getCtrlElmProps(formCtrl);
  return {
    id: ctrlProps['aria-describedby'] = ctrlProps.id + '-desc',
  };
};
