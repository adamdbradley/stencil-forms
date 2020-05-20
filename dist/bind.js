import { toDashCase } from './utils/helpers';
import { InstanceId, state } from './utils/state';
import { inputControl, inputControlGroup } from './input-control';
export const bind = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'string'));
export const bindBoolean = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'checked', 'boolean'));
export const bindNumber = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onInput', 'value', 'number'));
export const bindGroup = (instance, propName, bindOpts) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'onChange', 'value', 'string'));
const normalizeBindOpts = (bindOpts, instance, propName, changeEventName, valuePropName, valuePropType) => {
    let instanceId = instance[InstanceId];
    if (instanceId == null) {
        instanceId = instance[InstanceId] = state.i++;
    }
    return Object.assign(Object.assign({ i: toDashCase(propName) + instanceId, n: propName, changeEventName,
        valuePropName,
        valuePropType }, bindOpts), { onValueChange: (value) => (instance[propName] = value) });
};
