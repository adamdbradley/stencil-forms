export declare const isBoolean: (v: any) => v is string;
export declare const isFunction: (v: any) => v is Function;
export declare const isNumber: (v: any) => v is number;
export declare const isString: (v: any) => v is string;
export declare const isPromise: (v: any) => v is Promise<any>;
export declare const toDashCase: (str: string) => string;
export declare const setAttribute: (elm: HTMLElement | undefined, attrName: string, attrValue?: string) => string;
export declare const showNativeReport: (elm: HTMLElement | undefined) => boolean;
