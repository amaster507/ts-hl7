import { SubComponent } from '../types'
import { findCharsFirstPos } from './findCharsFirstPos'

export const decodeSubComponent = (
  input: string,
  sc: string[]
): [remaining: string, value: SubComponent] => {
  const i = findCharsFirstPos(input, sc)
  return [input.slice(i), input.slice(0, i)]
}
