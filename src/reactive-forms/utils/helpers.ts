export const isNumber = (v: any): v is boolean => typeof v === 'number';
export const isString = (v: any): v is boolean => typeof v === 'string';
export const isFunction = (v: any): v is boolean => typeof v === 'function';
export const isPromise = (v: any): v is Promise<any> =>
  !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);

export const createRandomId = (prefix: string) => prefix + '-' + Math.round(Math.random() * 99999);
