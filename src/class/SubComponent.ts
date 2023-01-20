import { SubComponent } from '../types'

export class Sub {
  private _sub: SubComponent
  constructor(subComponent: SubComponent) {
    this._sub = subComponent
  }

  public raw = () => this._sub

  public toString = () => this._sub ?? ''
}
