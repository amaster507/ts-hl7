export declare type OneOrMany<T> = T | T[];
export declare type SubComponent = string | null | undefined;
export declare type Component = OneOrMany<SubComponent>;
export declare type Field = OneOrMany<Component>;
export declare type FieldRep = [{
    rep: true;
}, ...Field[]];
declare type FieldsOrReps = (Field | FieldRep)[];
export declare type Segment = [name: string, ...fields: FieldsOrReps];
export declare type Segments = Segment[];
export interface MessageMeta {
    /**
     * MSH-12
     * length: 5
     * Table: 0104 @see https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0104
     * @example 2.5.1
     */
    version?: `${number}.${number}` | `${number}`;
    /**
     * MSH-9.1
     * length: 3
     * Table: 0076 @see https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0076
     * @example ADT
     */
    messageCode?: string;
    /**
     * MSH-9.2
     * length: 3
     * Table: 0003 @see https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0003
     * @example A01
     */
    triggerEvent?: string;
    /**
     * MSH-9.3
     * length: 7
     * Table 0354 @see https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0354
     * @example ADT_A01
     */
    messageStructure?: `${string}_${string}`;
    /**
     * MSH-10
     * length: 20
     * datatype: ST
     * @example ABC-1234.1
     */
    messageControlId?: string;
    encodingCharacters: {
        fieldSep: string;
        componentSep: string;
        subComponentSep: string;
        repetitionSep: string;
        escapeChar: string;
        subCompRepSep?: string;
    };
}
export declare type Message = [MessageMeta, ...Segments[]];
export declare type FuncDecodeHL7 = (HL7: string, encodingCharacters?: MessageMeta['encodingCharacters']) => Message | undefined;
export declare type FuncGetEncodingChars = (segment: string) => MessageMeta['encodingCharacters'];
export declare type FuncDecodeSegment = (hl7: string, meta: MessageMeta) => Segment;
export declare type FuncDecodeField = (hl7: string, meta: MessageMeta, fields?: FieldsOrReps) => [hl7: string, fields: FieldsOrReps];
export declare type FuncDecodeComponent = (hl7: string, meta: MessageMeta, components?: Component[]) => [hl7: string, field: Field];
export declare type FuncDecodeSubComponent = (hl7: string, meta: MessageMeta, subComponents?: Component[]) => [hl7: string, component: Component];
export declare type RepType = [{
    rep: true;
}, ...(string | null | undefined)[]] | null | undefined | string | (null | string | undefined)[];
export declare type SepType = OneOrMany<RepType>;
export declare type FuncDecodeRepSep<R extends RepType, S extends OneOrMany<R>> = (hl7: string, repChar: string | undefined, sepChar: string, callback: (hl7: string, stopChars: string[]) => [hl7: string, value: S]) => [hl7: string, ...value: (OneOrMany<S> | null | undefined)[]];
export {};
