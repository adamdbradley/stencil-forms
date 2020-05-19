import { inputControl, inputControlGroup } from './input-control';
import { state } from './utils/state';
export const control = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'string'));
export const controlBoolean = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onChange', 'checked', 'boolean'));
export const controlNumber = (value, ctrlOpts) => inputControl(value, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'number'));
export const controlGroup = (selectedValue, ctrlOpts) => inputControlGroup(selectedValue, normalizeControlOpts(ctrlOpts, 'onChange', 'value', 'string'));
const normalizeControlOpts = (ctrlOpts, changeEventName, valuePropName, valuePropType) => {
    const propName = 'ctrl' + state.i++;
    return Object.assign({ id: propName, name: propName, changeEventName,
        valuePropName,
        valuePropType }, ctrlOpts);
};
