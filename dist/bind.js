import { toDashCase } from './helpers';
import { instanceIds, state } from './state';
import { inputControl, inputControlGroup } from './input-control';
export const bind = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'string'));
export const bindBoolean = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'checked', 'boolean'));
export const bindNumber = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'number'));
export const bindGroup = (instance, propName, bindOpts) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'value', 'string'));
const normalizeBindOpts = (bindOpts, instance, propName, changeEventName, valuePropName, valuePropType) => {
    let instanceId = instanceIds.get(instance);
    if (instanceId == null) {
        instanceIds.set(instance, (instanceId = state.i++));
    }
    return {
        i: toDashCase(propName) + instanceId,
        n: propName,
        changeEventName,
        valuePropName,
        valuePropType,
        ...bindOpts,
        onValueChange: ({ value }) => (instance[propName] = value),
    };
};
