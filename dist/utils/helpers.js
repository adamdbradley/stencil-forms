export const isFunction = (v) => typeof v === 'function';
export const isNumber = (v) => typeof v === 'number';
export const isString = (v) => typeof v === 'string';
export const isPromise = (v) => !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);
export const toDashCase = (str) => str
    .toLowerCase()
    .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
    .trim()
    .replace(/ /g, '-');
export const isBooleanInput = (elm) => elm.nodeName === 'INPUT' && elm.type === 'checkbox';
