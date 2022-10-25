import { OneOrMany } from '../types';
export declare const decodeRepSep: <RepType extends string | [{
    rep: true;
}, ...(string | null)[]] | (string | null)[] | null | undefined, SepType extends OneOrMany<RepType>>(input: string, rep: string | undefined, sep: string, callback: (encoded: string, stopChars: string[]) => [input: string, value: SepType]) => [string, ...(OneOrMany<SepType> | null | undefined)[]];
