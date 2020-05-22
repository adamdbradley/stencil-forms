export const isFunction = (v) => typeof v === 'function';
export const isNumber = (v) => typeof v === 'number';
export const isString = (v) => typeof v === 'string';
export const isPromise = (v) => !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);
export const toDashCase = (str) => str
    .toLowerCase()
    .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
    .trim()
    .replace(/ /g, '-');
export const setAttribute = (elm, attrName, attrValue = '') => (elm === null || elm === void 0 ? void 0 : elm.setAttribute(attrName, attrValue), attrValue);
export const showNativeReport = (elm) => { var _a, _b; return !(elm === null || elm === void 0 ? void 0 : elm.hasAttribute('formnovalidate')) && !((_b = (_a = elm) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.hasAttribute('novalidate')); };
