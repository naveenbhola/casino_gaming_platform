export declare function tokenGetter(): string;
export declare class WDTSUtility {
    static validateNumberField(_event: any, maxLength?: any, value?: any): boolean;
    static numberWithDecimal(event: any): boolean;
    static equalIgnoreCase(string1: any, string2: any, ignoreCase: any, useLocale: any): boolean;
    static isNonZeroRegex(evt: any, maxlen: any): boolean;
}
/**
 * @description: this function flat the nested object and return
 * Array containg object: Leve1 object.
 * @param obj
 * @param arr
 */
export declare function flatObject(obj: any, arr: any): any;
/**
 * check if object properties is equal
 */
export declare function isEquivalent(a: any, b: any): boolean;
