import { controlGroupOptsMap } from './utils/state';
import { isString } from './utils/helpers';
import type { ReactiveFormControl } from './utils/types';

export const descriptionFor = (ctrl: ReactiveFormControl) => {
  const props = ctrl();
  return {
    id: props['aria-describedby'] = props.id + '-dsc',
  };
};

export const errorFor = (ctrl: ReactiveFormControl) => {
  const props = ctrl();
  return {
    id: props['aria-errormessage'] = props.id + '-err',
  };
};

export const labelFor = (ctrl: ReactiveFormControl, groupItemId?: string) => {
  const ctrlProps = ctrl();
  const groupOpts = controlGroupOptsMap.get(ctrl);
  const props: any = {};

  if (groupOpts) {
    if (isString(groupItemId)) {
      // label for an group item
      props.id = ctrlProps['aria-labelledby'] = ctrlProps.id + '-' + groupItemId + '-lbl';
      props.htmlFor = ctrlProps.id + '-' + groupItemId;
    } else {
      // label for a group container
      props.id = ctrlProps.id + '-lbl';
      ctrlProps['aria-labelledby'] = ctrlProps.id + '-lbl';
    }
  } else {
    // label for a control
    props.id = ctrlProps['aria-labelledby'] = ctrlProps.id + '-lbl';
    props.htmlFor = ctrlProps.id;
  }

  return props;
};
