import { inputControl, inputControlGroup } from './input-control';
import { state } from './state';
export const control = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts));
export const controlBoolean = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'boolean'));
export const controlNumber = (initialValue, ctrlOpts) => inputControl(initialValue, normalizeControlOpts(ctrlOpts, 'number'));
export const controlGroup = (initialSelectedValue, ctrlOpts) => inputControlGroup(initialSelectedValue, normalizeControlOpts(ctrlOpts));
const normalizeControlOpts = (ctrlOpts, valuePropType = 'string') => {
    const propName = 'ctrl' + state.i++;
    return {
        i: propName,
        n: propName,
        valuePropType,
        ...ctrlOpts,
    };
};
