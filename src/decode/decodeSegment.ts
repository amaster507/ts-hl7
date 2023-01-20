import { FuncDecodeSegment } from '../types'
// import { decodeField } from './decodeField'
import { decodeRepSep } from './decodeRepSep'
import { findCharsFirstPos } from './findCharsFirstPos'
import { getEncodingChars } from './getEncodingChars'

export const decodeSegment: FuncDecodeSegment = (HL7, meta) => {
  const name = HL7.match(new RegExp(`^([A-Z][A-Z0-9]{2})`))?.[1]
  if (!name) {
    throw Error(`Expected segment name, got ${HL7.slice(0, 20)}`)
  }
  HL7 = HL7.slice(3)
  let isMSH = false
  if (name === 'MSH') {
    isMSH = true
    meta.encodingCharacters = getEncodingChars(HL7.slice(0, 8))
    HL7 = HL7.slice(Object.keys(meta.encodingCharacters).length)
  } else if (HL7.startsWith(meta.encodingCharacters.fieldSep)) {
    HL7 = HL7.slice(1)
  }
  const [hl7, fields] = decodeRepSep(
    HL7,
    meta.encodingCharacters.repetitionSep,
    meta.encodingCharacters.fieldSep,
    (input, stopChars) => {
      const i = findCharsFirstPos(input, stopChars)
      const [, val] = decodeRepSep(
        input.slice(0, i),
        undefined,
        meta.encodingCharacters.componentSep,
        (input, stCh) => {
          stCh.push(...stopChars)
          const i = findCharsFirstPos(input, stCh)
          const [, val] = decodeRepSep(
            input.slice(0, i),
            undefined,
            meta.encodingCharacters.subComponentSep,
            (input, sc) => {
              sc.push(...stCh)
              const i = findCharsFirstPos(input, sc)
              return [input.slice(i), input.slice(0, i)]
            }
          )
          input = input.slice(i)
          return [input, val]
        }
      )
      input = input.slice(i)
      return [input, val]
    }
  )
  if (isMSH) {
    const {
      fieldSep,
      componentSep,
      repetitionSep,
      escapeChar,
      subComponentSep,
      subCompRepSep,
    } = meta.encodingCharacters
    if (!Array.isArray(fields)) throw Error('Expected array of fields')
    fields?.unshift(
      fieldSep,
      `${componentSep}${repetitionSep}${escapeChar}${subComponentSep}${
        subCompRepSep ? subCompRepSep : ''
      }`
    )
  }
  if (hl7) console.log('Not Fully Decoded: ', hl7)
  if (fields === null || fields === undefined) return [name]
  if (Array.isArray(fields)) return [name, ...fields]
  return [name, fields]
}
