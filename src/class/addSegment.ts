import decode from '../decode'
import { Message, Segment } from '../types'

export const addSegment = (segment: string | Segment, msg: Message) => {
  if (typeof segment === 'string') {
    const seg = decode(segment)
    if (seg === undefined) {
      return false
    }
    msg[1].push(...seg[1])
    return msg
  } else if (segment.length > 0) {
    msg[1].push(segment)
    return msg
  }
  return false
}
