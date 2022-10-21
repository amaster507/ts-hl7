import { getSegment } from './class/getSegment'
import decode from './decode'
import encode from './encode'
import { Component, Field, Message, Segment } from './types'

/** MESSAGE
 * A message is the atomic unit of data transferred between systems. It is comprised of a group of segments in a defined sequence. Each message has a message type that defines its purpose. For example the ADT Message type is used to transmit portions of a patient's Patient Administration (ADT) data from one system to another. A three-character code contained within each message identifies its type. These are listed in the Message Type list, Appendix A.
 * The real-world event that initiates an exchange of messages is called a trigger event. See Section 2.3.1, "Trigger events," for a more detailed description of trigger events. Refer to HL7 Table 0003 - Event type for a listing of all defined trigger events. These codes represent values such as A patient is admitted or An order event occurred. There is a one-to-many relationship between message types and trigger event codes. The same trigger event code may not be associated with more than one message type; however a message type may be associated with more than one trigger event code.
 * All message types and trigger event codes beginning with the letter "Z" are reserved for locally defined messages. No such codes will be defined within the HL7 Standard.
 *
 * @see http://www.hl7.eu/HL7v2x/v251/std251/ch02.html#Heading11
 */
export class Msg {
  public msg: Message
  private _msg: Message = [
    {
      encodingCharacters: {
        fieldSep: '|',
        componentSep: '^',
        subComponentSep: '&',
        repetitionSep: '~',
        escapeChar: '\\',
      },
    },
    [['MSH', '|', '^~\\&']],
  ]
  constructor(msg?: Message | string) {
    if (typeof msg === 'string') {
      this.msg = decode(msg) ?? this._msg
    } else if (msg !== undefined) {
      this.msg = msg
    } else {
      this.msg = this._msg
    }
  }

  public addSegment = (segment: string | Segment) => {
    if (typeof segment === 'string') {
      const seg = decode(segment)
      if (seg === undefined) {
        return false
      }
      this.msg[1].push(...seg[1])
      return this.msg
    } else if (segment.length > 0) {
      this.msg[1].push(segment)
      return this.msg
    }
    return false
  }

  public toString = () => {
    return encode(this.msg)
  }

  public get = (path: string | undefined) => {
    if (path === undefined) return this.msg
    const segRx = '([A-Z][A-Z0-9]{2})'
    const repRx = '(?:\\[([0-9]+)\\])'
    const posRx = '(?:[-\\.]([0-9]+))'
    const pathRx = new RegExp(
      `^(?:${segRx})${repRx}?(?:${posRx}${repRx}?(?:${posRx}${posRx}?)?)?$`
    )
    const paths = path.match(pathRx)
    const [
      ,
      segmentName,
      segmentIteration,
      fieldPosition,
      fieldIteration,
      componentPosition,
      subComponentPosition,
    ] = paths ?? []
    return this._get(
      segmentName,
      segmentIteration === undefined ? undefined : parseInt(segmentIteration),
      fieldPosition === undefined ? undefined : parseInt(fieldPosition),
      fieldIteration === undefined ? undefined : parseInt(fieldIteration),
      componentPosition === undefined ? undefined : parseInt(componentPosition),
      subComponentPosition === undefined
        ? undefined
        : parseInt(subComponentPosition)
    )
  }

  private _get = (
    segmentName: string | undefined,
    segmentIteration?: number | undefined,
    fieldPosition?: number | undefined,
    fieldIteration?: number | undefined,
    componentPosition?: number | undefined,
    subComponentPosition?: number | undefined
  ) => {
    const ret = getSegment(this.msg, segmentName)
      .filter((_seg, i) => {
        if (segmentIteration === undefined) return true
        return i === segmentIteration - 1
      })
      .map((seg) => {
        if (fieldPosition === undefined) return seg
        return seg?.[fieldPosition]
      })
      .map((field) => {
        if (
          Array.isArray(field) &&
          field.length > 1 &&
          typeof field[0] === 'object' &&
          field[0]?.hasOwnProperty('rep')
        ) {
          let f: Component[] | Field[] = []
          if (fieldIteration === undefined) {
            f = [...field] as Component[] | Field[]
            f.shift()
          } else if (Array.isArray(field) && fieldIteration > 0) {
            f = (field as unknown[]).filter((f, i) => {
              if (fieldIteration === undefined) return true
              return i === fieldIteration
            }) as Component[] | Field[]
          }
          if (componentPosition !== undefined && componentPosition > 0) {
            f = f
              .map((comp) => comp?.[componentPosition - 1])
              .map((comp) => {
                if (
                  !Array.isArray(comp) ||
                  subComponentPosition === undefined ||
                  subComponentPosition < 1
                )
                  return comp
                return comp?.[subComponentPosition - 1]
              })
          }
          if (Array.isArray(f) && f.length === 1) {
            return f[0]
          }
          return f
        }
        if (Array.isArray(field)) {
          if (componentPosition === undefined || componentPosition < 1)
            return field
          const comp = field?.[componentPosition - 1]
          if (
            !Array.isArray(comp) ||
            subComponentPosition === undefined ||
            subComponentPosition < 1
          )
            return comp
          return comp?.[subComponentPosition - 1]
        }
        return field
      })
    if (ret.length === 1) return ret[0]
    return ret
  }
}

export default Msg
