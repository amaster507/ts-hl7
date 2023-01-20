import decodeHL7 from '../decode'
import { decodeSegment } from '../decode/decodeSegment'
import { Message, Paths } from '../types'

export const setValue = (
  msg: Message,
  {
    segmentName,
    segmentIteration,
    fieldPosition,
    fieldIteration,
    componentPosition,
    subComponentPosition,
  }: Paths,
  value: string
): Message => {
  let completed = false
  // set the value as the entirity of the message, an empty path, means you are sending a stringified hl7 message.
  if (segmentName === undefined) {
    const [, segments] =
      decodeHL7(value, msg[0].encodingCharacters) ??
      ([, []] as unknown as Message)
    return [msg[0], segments]
  }
  // cannot set a path where no segments currently exist, use addSegment instead.
  if (msg.length < 2 || msg[1].length === 0) {
    // FixMe: should this throw an error instead?
    return msg
  }
  let segIndex = 0
  msg[1].forEach((seg, i) => {
    if (seg[0] === segmentName) {
      if (segmentIteration) {
        segIndex++
      }
      if (segIndex === segmentIteration || segmentIteration === undefined) {
        if (fieldPosition === undefined) {
          // set the value of the entire segment.
          msg[1][i] = decodeSegment(value, msg[0])
          completed = true
        } else {
          // continue doing something more here....
        }
      }
    }
  })
  if (!completed) console.warn('Value not set...') // ToDo: more details on why??
  return msg
}
