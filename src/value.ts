import type { ControlElement, ControlData } from './types';

export const getValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement) => {
  const value: any = (ctrlElm as any)[ctrlData.valuePropName!];
  if (ctrlData.valuePropType === 'boolean') {
    return String(value) === 'true';
  }
  if (ctrlData.valuePropType === 'number') {
    return parseFloat(value);
  }
  return String(value);
};

export const setValueFromControlElement = (ctrlData: ControlData, ctrlElm: ControlElement, value: any) =>
  ((ctrlElm as any)[ctrlData.valuePropName!] = ctrlData.valuePropType === 'boolean' ? !!value : String(value));
