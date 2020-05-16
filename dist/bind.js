import { control, controlBoolean, controlGroup } from './control';
import { toDashCase } from './utils/helpers';
export const bind = (instance, propName, bindOpts) => control(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
export const bindBoolean = (instance, propName, bindOpts) => controlBoolean(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
export const bindGroup = (instance, propName, bindOpts) => controlGroup(instance[propName], normalizeBindOpts(bindOpts, instance, propName));
const normalizeBindOpts = (bindOpts, instance, propName) => {
    const ctrlOpts = Object.assign(Object.assign({ id: toDashCase(propName), name: propName }, bindOpts), { onValueChange: (value) => (instance[propName] = value) });
    return ctrlOpts;
};
