import { ControlElement, ReactiveFormOptions } from './types';
import { checkValidity } from './validation';
import { ctrlMap, ctrlDataMap } from './utils/state';
import { isFunction } from './utils/helpers';

export const controlForm = (opts: ReactiveFormOptions = {}) => () => {
  return {
    onSubmit: (ev: Event) => onFormSubmit(ev, opts),
  };
};

const onFormSubmit = (ev: Event, opts: ReactiveFormOptions) => {
  ev.preventDefault();
  ev.stopPropagation();

  const formElm: HTMLFormElement = ev.currentTarget as any;
  const formElms = formElm.elements;

  const submit = () => {
    const isValid = formElm.reportValidity();
    if (isValid && isFunction(opts.onSubmit)) {
      const formData = new FormData(formElm);
      opts.onSubmit(ev, formData);
      formElm.submit();
    }
  };

  let hasCtrlValidate = false;
  let i = 0;
  const cb = () => {
    i--;
    if (i <= 0) {
      submit();
    }
  };

  for (let i = 0; i < formElms.length; i++) {
    const ctrlElm = formElms[i] as ControlElement;
    const ctrl = ctrlMap.get(ctrlElm);
    if (ctrl) {
      const ctrlData = ctrlDataMap.get(ctrl);
      if (ctrlData) {
        i++;
        hasCtrlValidate = true;
        checkValidity(ctrlData, ctrlElm, ev, cb);
      }
    }
  }

  if (!hasCtrlValidate) {
    submit();
  }
};
