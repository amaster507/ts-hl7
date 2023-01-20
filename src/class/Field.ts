import { encodeRep } from '../encode/encodeRep'
import { encodeSep } from '../encode/encodeSep'
import { Component, Field, FieldRep } from '../types'
import { Cmp, Cmps } from './Component'

export class Fld {
  private _fld: Field | FieldRep
  private _compSep = '^'
  private _subCompSep = '&'
  private _repSep = '~'
  private _escChar = '\\'
  constructor(field: Field | FieldRep) {
    this._fld = field
  }

  public raw = () => this._fld

  public toString = ({
    compSep = this._compSep,
    subCompSep = this._subCompSep,
    repSep = this._repSep,
    escChar = this._escChar,
  } = {}) => {
    this._compSep = compSep
    this._subCompSep = subCompSep
    this._repSep = repSep
    this._escChar = escChar
    return encodeRep(this._fld, repSep, (rep) => {
      return encodeSep(rep, compSep, (comp) => {
        return encodeSep(comp, subCompSep)
      })
    })
  }

  /**
   * get a component from a field
   * @param componentPosition 1-indexed component position to get. Defaults to 1.
   * @returns a Component Class or an array of Component Classes
   */
  public getComponent = (
    componentPosition: number | undefined = 1
  ): Cmp | Cmps => {
    if (this._fld === null) return new Cmp(null)
    if (!Array.isArray(this._fld)) {
      if (componentPosition === undefined || componentPosition === 1)
        return new Cmp(this._fld)
      return new Cmp(null)
    }
    if (this._fld.length === 0) return new Cmp(null)
    if (
      typeof this._fld[0] === 'object' &&
      this._fld[0]?.hasOwnProperty('rep')
    ) {
      const [, ...fields] = this._fld as FieldRep
      return new Cmps(
        fields.map((field) => new Cmp(field?.[componentPosition - 1] ?? null))
      )
    }
    return new Cmp((this._fld as Component[])?.[componentPosition - 1] ?? null)
  }
}
