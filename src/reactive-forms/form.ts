import type { ReactiveForm, ReactiveFormOptions, ReactiveFormControlOptions } from './utils/types';
import { control, controlGroup } from './control';
import { createRandomId, isString } from './utils/helpers';

export const reactiveForm = (formOpts?: ReactiveFormOptions) => {
  const form: ReactiveForm = { ...formOpts };

  const submit = {
    type: 'submit',
  };

  if (!isString(form.id)) {
    form.id = createRandomId('form');
  }

  return {
    form: () => form,
    control: (value: any, ctrlOpts?: ReactiveFormControlOptions) => control(form, value, ctrlOpts),
    controlGroup: (value: any, ctrlOpts?: ReactiveFormControlOptions) => controlGroup(form, value, ctrlOpts),
    submit: () => submit,
  };
};
