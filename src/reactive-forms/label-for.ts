export const labelFor = (formCtrl: ReactiveFormControl | ReactiveFormControlGroup, groupItemId?: string) => {
  const ctrls = (formCtrl as ReactiveFormControlGroup).ctrls;
  if (ctrls && isString(groupItemId)) {
    formCtrl = ctrls.get(groupItemId);
  }

  const ctrlProps = getCtrlElmProps(formCtrl);
  return {
    id: ctrlProps['aria-labelledby'] = ctrlProps.id + '-lbl',
    htmlFor: ctrlProps.id,
  };
};

export const labelForGroup = (formCtrlGroup: ReactiveFormControlGroup) => {
  const ctrlProps = getCtrlElmProps(formCtrlGroup);
  return {
    id: ctrlProps['aria-labelledby'] = ctrlProps.id + '-lbl',
  };
};
