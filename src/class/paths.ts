import { Paths } from '../types'

export const paths = (path?: string): Paths => {
  if (path === undefined || path === '') return {}
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
  return {
    segmentName,
    segmentIteration:
      segmentIteration === undefined ? undefined : parseInt(segmentIteration),
    fieldPosition:
      fieldPosition === undefined ? undefined : parseInt(fieldPosition),
    fieldIteration:
      fieldIteration === undefined ? undefined : parseInt(fieldIteration),
    componentPosition:
      componentPosition === undefined ? undefined : parseInt(componentPosition),
    subComponentPosition:
      subComponentPosition === undefined
        ? undefined
        : parseInt(subComponentPosition),
  }
}
