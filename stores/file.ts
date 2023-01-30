import { randomUUID } from 'crypto'
import fs from 'fs'
import Msg from '../src'
import { StoreFunc, StoreOption } from './types'

export interface IDBStoreOptions extends StoreOption {
  rootPath?: string
  path?: string[]
  format?: 'string' | 'json'
  overwrite?: boolean
  append?: boolean
  autoCreateDir?: boolean
  warnOnError?: boolean
  extension?: string
  id?: string
}

class DBStore {
  private rootPath: NonNullable<IDBStoreOptions['rootPath']>
  private path: NonNullable<IDBStoreOptions['path']>
  private overwrite: NonNullable<IDBStoreOptions['overwrite']>
  private append: NonNullable<IDBStoreOptions['append']>
  private autoCreateDir: NonNullable<IDBStoreOptions['autoCreateDir']>
  private warnOnError: NonNullable<IDBStoreOptions['warnOnError']>
  private extension: NonNullable<IDBStoreOptions['extension']>
  private format: NonNullable<IDBStoreOptions['format']>
  constructor({
    rootPath = '',
    path = [],
    overwrite = false,
    append = true,
    autoCreateDir = true,
    warnOnError = false,
    extension = '.hl7',
    format = 'string',
  }: IDBStoreOptions = {}) {
    this.rootPath = rootPath
    this.overwrite = overwrite
    this.append = append
    this.autoCreateDir = autoCreateDir
    this.warnOnError = warnOnError
    this.extension = extension
    this.format = format
    this.path = path
  }
  public store: StoreFunc<Msg, IDBStoreOptions> = async (
    data,
    {
      rootPath = this.rootPath,
      path = this.path,
      format = this.format,
      overwrite = this.overwrite,
      append = this.append,
      autoCreateDir = this.autoCreateDir,
      warnOnError = this.warnOnError,
      extension = this.extension,
    } = {},
    id?: string
  ) => {
    // TODO: add store specific options for things like file extensions and formatting
    let filename = id ? id : randomUUID()
    let dirname = ''
    path
      .map((p) => {
        if (p.charAt(0) === '$') {
          return data.get(p.slice(1))?.toString() ?? ''
        }
        return p
      })
      .forEach((p) => {
        if (p !== '') dirname = `${p}/${dirname}`
      })
    if (rootPath !== '') dirname = `${rootPath}/${dirname}`
    filename = `${dirname}/${filename}${extension}`
    if (this.autoCreateDir && !fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true })
    }
    let contents = JSON.stringify(data)
    if (this.format === 'string') {
      if (typeof data?.toString === 'function') {
        contents = data.toString()
      }
    }
    if (!this.overwrite && !this.append && fs.existsSync(filename)) {
      if (this.warnOnError) {
        console.warn(
          `Options set to not overwrite and not append, but the file: ${filename} already exists`
        )
      } else {
        throw new Error(
          `Options set to not overwrite and not append, but the file: ${filename} already exists`
        )
      }
    }
    fs.writeFile(
      filename,
      contents,
      { flag: this.append ? 'a' : 'w' },
      (err) => {
        if (err) {
          if (this.warnOnError) {
            console.warn(err)
          } else {
            console.error(err)
            throw new Error(JSON.stringify(err))
          }
        } else {
          console.log(`file written to ${filename}`)
        }
      }
    )
  }

  // public update = this.store
}

export default DBStore
