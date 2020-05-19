export const isFunction = (v: any): v is Function => typeof v === 'function';
export const isNumber = (v: any): v is number => typeof v === 'number';
export const isString = (v: any): v is string => typeof v === 'string';
export const isPromise = (v: any): v is Promise<any> =>
  !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);

export const toDashCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
    .trim()
    .replace(/ /g, '-');

export const setAttribute = (elm: HTMLElement, attrName: string, attrValue = '') => (
  elm.setAttribute(attrName, attrValue), attrValue
);
