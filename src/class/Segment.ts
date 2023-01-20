import encodeHL7 from '../encode'
import { Field, FieldRep, Segment } from '../types'
import { Fld } from './Field'

export class Seg {
  private _seg: Segment
  private _fieldSep = '|'
  private _compSep = '^'
  private _subCompSep = '&'
  private _repSep = '~'
  private _escChar = '\\'
  constructor(segment: Segment) {
    this._seg = segment
  }

  public raw = () => this._seg

  public toString = ({
    fieldSep = this._fieldSep,
    compSep = this._compSep,
    subCompSep = this._subCompSep,
    repSep = this._repSep,
    escChar = this._escChar,
  } = {}) => {
    this._fieldSep = fieldSep
    this._compSep = compSep
    this._subCompSep = subCompSep
    this._repSep = repSep
    this._escChar = escChar
    return encodeHL7([
      {
        encodingCharacters: {
          fieldSep,
          componentSep: compSep,
          subComponentSep: subCompSep,
          repetitionSep: repSep,
          escapeChar: escChar,
        },
      },
      [this._seg],
    ])
  }

  public getField = (
    fieldPosition: number,
    // NOTE: iteration is 1-indexed
    fieldIteration?: number | undefined
  ): Fld => {
    const field = this._seg?.[fieldPosition]
    if (
      fieldIteration !== undefined &&
      Array.isArray(field) &&
      field.length > 1 &&
      typeof field[0] === 'object' &&
      field[0]?.hasOwnProperty('rep')
    ) {
      const [, ...fields] = field as FieldRep
      return new Fld(fields?.[fieldIteration - 1] ?? null)
    } else if (fieldIteration !== undefined) {
      return new Fld(null)
    }
    return new Fld(field)
  }
}
