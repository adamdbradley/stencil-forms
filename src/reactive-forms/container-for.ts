import { controlGroupOptsMap, ctrlElmAttrsMap } from './utils/state';
import { isString } from './utils/helpers';
import type { ReactiveFormControl } from './utils/types';

export const descriptionFor = (ctrl: ReactiveFormControl) => {
  const inputId = ctrl().id;
  const containerId = inputId + '-dsc';
  const attrsMap = ctrlElmAttrsMap.get(ctrl);

  if (attrsMap) {
    attrsMap.set('aria-describedby', containerId);
  }

  return {
    id: containerId,
  };
};

export const errorFor = (ctrl: ReactiveFormControl) => {
  const inputId = ctrl().id;
  const containerId = inputId + '-err';
  const attrsMap = ctrlElmAttrsMap.get(ctrl);

  if (attrsMap) {
    attrsMap.set('aria-errormessage', containerId);
  }

  return {
    id: containerId,
  };
};

export const labelFor = (ctrl: ReactiveFormControl, groupItemId?: string) => {
  const ctrlProps = ctrl();
  const groupOpts = controlGroupOptsMap.get(ctrl);
  const attrsMap = ctrlElmAttrsMap.get(ctrl);
  const labelProps: any = {};

  if (groupOpts) {
    if (isString(groupItemId)) {
      // label for an group item
      labelProps.id = ctrlProps.id + '-' + groupItemId + '-lbl';
      labelProps.htmlFor = ctrlProps.id + '-' + groupItemId;
    } else {
      // label for a group container
      labelProps.id = ctrlProps.id + '-lbl';
    }
  } else {
    // label for a control
    labelProps.id = ctrlProps.id + '-lbl';
    labelProps.htmlFor = ctrlProps.id;
  }

  if (attrsMap) {
    attrsMap.set('aria-labelledby', labelProps.id);
  }

  return labelProps;
};
