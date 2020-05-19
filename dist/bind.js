import { toDashCase } from './utils/helpers';
import { instanceIds, state } from './utils/state';
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
    return Object.assign(Object.assign({ id: toDashCase(propName) + '-' + instanceId, name: propName, changeEventName,
        valuePropName,
        valuePropType }, bindOpts), { onValueChange: (value) => (instance[propName] = value) });
};
