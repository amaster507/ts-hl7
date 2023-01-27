import { randomUUID } from 'crypto'
import fs from 'fs'

class DBStore {
  private uri: string
  constructor(uri: string) {
    this.uri = uri
  }
  public store = async <T extends Record<string, unknown>>(
    data: T,
    table = '',
    namespace = '',
    database = '',
    id?: string
  ) => {
    // TODO: add store specific options for things like file extensions and formatting
    let filename = id ? id : randomUUID()
    if (table !== '') filename = `${table}/${filename}`
    if (database !== '') filename = `${database}/${filename}`
    if (namespace !== '') filename = `${namespace}/${filename}`
    filename = `${this.uri}/${filename}`
    fs.writeFile(filename, JSON.stringify(data), (err) => {
      if (err) console.warn(err)
    })
  }

  public update = this.store
}

export default DBStore
