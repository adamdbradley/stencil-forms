import { inputControl, inputControlGroup } from './input-control';
import { instanceIds, state } from './state';
import { toDashCase } from './helpers';
import { setCastedBindValue } from './value';
export const bind = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
export const bindBoolean = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'boolean'));
export const bindNumber = (instance, propName, bindOpts) => inputControl(instance[propName], normalizeBindOpts(bindOpts, instance, propName, 'number'));
export const bindGroup = (instance, propName, bindOpts) => inputControlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
const normalizeBindOpts = (bindOpts, instance, propName, valuePropType = 'string') => {
    let instanceId = instanceIds.get(instance);
    if (instanceId == null) {
        instanceIds.set(instance, (instanceId = state.i++));
    }
    return {
        i: toDashCase(propName) + instanceId,
        n: propName,
        valuePropType,
        ...bindOpts,
        onValueChange: ({ value }) => setCastedBindValue(instance, propName, value),
    };
};
