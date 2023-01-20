import { encodeSep } from '../encode/encodeSep'
import { Component } from '../types'
import { Sub } from './SubComponent'

export class Cmp {
  private _cmp: Component
  private _subCompSep = '&'
  constructor(component: Component) {
    this._cmp = component
  }

  public raw = () => this._cmp
  public one = () => this
  public toString = ({ subCompSep = this._subCompSep } = {}): string => {
    this._subCompSep = subCompSep
    return encodeSep(this._cmp, subCompSep) as string
  }

  public getSubComponent = (subComponentPosition: number | undefined = 1) => {
    if (this._cmp === null) return new Sub(null)
    if (Array.isArray(this._cmp)) {
      return new Sub(this._cmp[subComponentPosition - 1] ?? null)
    } else if (subComponentPosition > 1) return new Sub(null)
    return new Sub(this._cmp)
  }
}

export class Cmps {
  private _cmps: Cmp[]
  private _subCompSep = '&'
  private _fieldRepSep = '~'
  constructor(components: Cmp[]) {
    this._cmps = components
  }

  public raw = () => this._cmps.map((c) => c.raw())

  /**
   * In case where the field is a repeating field, this will `one` function gets only one of the fields
   * @param iteration 1-indexed repeating field component to use. Defaults to 1.
   * @returns a singular Component Class
   */
  public one = (iteration = 1) => this._cmps[iteration - 1] ?? new Cmp(null)

  public toString = (
    { subCompSep = this._subCompSep, fieldRepSep = this._fieldRepSep } = {},
    stringify = false
  ) => {
    this._subCompSep = subCompSep
    this._fieldRepSep = fieldRepSep
    const strings = this._cmps.map((c) => c.toString({ subCompSep }))
    if (stringify) return strings.join(fieldRepSep)
    return strings
  }
}
