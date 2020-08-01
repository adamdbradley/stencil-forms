import { inputControl, inputControlGroup } from './input-control';
import { state } from './state';
export const control = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'string'));
export const controlBoolean = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onChange', 'checked', 'boolean'));
export const controlNumber = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'onInput', 'value', 'number'));
export const controlGroup = (initialSelectedValue, ctrlOpts) => inputControlGroup(initialSelectedValue, normalizeControlOpts(ctrlOpts, 'onChange', 'value', 'string'));
const normalizeControlOpts = (ctrlOpts, changeEventName, valuePropName, valuePropType) => {
    const propName = 'ctrl' + state.i++;
    return {
        i: propName,
        n: propName,
        changeEventName,
        valuePropName,
        valuePropType,
        ...ctrlOpts,
    };
};
