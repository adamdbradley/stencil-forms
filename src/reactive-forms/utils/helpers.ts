import type { ControlElement } from './types';

export const isNumber = (v: any): v is number => typeof v === 'number';
export const isString = (v: any): v is string => typeof v === 'string';
export const isFunction = (v: any): v is Function => typeof v === 'function';
export const isPromise = (v: any): v is Promise<any> =>
  !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);

export const toDashCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
    .trim()
    .replace(/ /g, '-');

export const isBooleanInput = (elm: ControlElement): elm is HTMLInputElement =>
  elm.nodeName === 'INPUT' && elm.type === 'checkbox';
