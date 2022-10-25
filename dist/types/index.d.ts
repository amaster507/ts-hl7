import { Field, Message, Segment } from './types';
/** MESSAGE
 * A message is the atomic unit of data transferred between systems. It is comprised of a group of segments in a defined sequence. Each message has a message type that defines its purpose. For example the ADT Message type is used to transmit portions of a patient's Patient Administration (ADT) data from one system to another. A three-character code contained within each message identifies its type. These are listed in the Message Type list, Appendix A.
 * The real-world event that initiates an exchange of messages is called a trigger event. See Section 2.3.1, "Trigger events," for a more detailed description of trigger events. Refer to HL7 Table 0003 - Event type for a listing of all defined trigger events. These codes represent values such as A patient is admitted or An order event occurred. There is a one-to-many relationship between message types and trigger event codes. The same trigger event code may not be associated with more than one message type; however a message type may be associated with more than one trigger event code.
 * All message types and trigger event codes beginning with the letter "Z" are reserved for locally defined messages. No such codes will be defined within the HL7 Standard.
 *
 * @see http://www.hl7.eu/HL7v2x/v251/std251/ch02.html#Heading11
 */
export declare class Msg {
    msg: Message;
    private _msg;
    constructor(msg?: Message | string);
    addSegment: (segment: string | Segment) => false | Message;
    toString: () => string;
    get: (path: string | undefined) => string | {
        rep: true;
    } | Message | (string | {
        rep: true;
    } | import("./types").FieldRep | [name: string, ...fields: (Field | import("./types").FieldRep)[]] | Field[] | null | undefined)[] | null | undefined;
    private _get;
}
export default Msg;
