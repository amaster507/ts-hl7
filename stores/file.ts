import { randomUUID } from 'crypto'
import fs from 'fs'
import Msg from '../src'
import { StoreFunc, StoreOption } from './types'

/**
 * @param path - Accepts HL7 references like `['$PID-5[1].1', '$PID-3[1].1']`. Each element in array is a directory. Empty strings will be filtered out.
 * @param filename - Accepts HL7 references like `['$PID-5[1].1', '_', '$PID-3[1].1']`. For advanced configuration, you can provide a function that receives the message and returns the filename string.
 * @param extension - Include leading `.`
 */
export interface IDBStoreOptions extends StoreOption {
  path?: string[]
  format?: 'string' | 'json' // TODO: support other formats?
  overwrite?: boolean
  append?: boolean
  autoCreateDir?: boolean
  warnOnError?: boolean
  extension?: string
  filename?: string | string[] | ((msg: Msg) => string)
}

class DBStore {
  private path: NonNullable<IDBStoreOptions['path']>
  private overwrite: NonNullable<IDBStoreOptions['overwrite']>
  private append: NonNullable<IDBStoreOptions['append']>
  private autoCreateDir: NonNullable<IDBStoreOptions['autoCreateDir']>
  private warnOnError: NonNullable<IDBStoreOptions['warnOnError']>
  private filename: NonNullable<IDBStoreOptions['filename']>
  private extension: NonNullable<IDBStoreOptions['extension']>
  private format: NonNullable<IDBStoreOptions['format']>
  constructor({
    path = ['local'],
    overwrite = true,
    append = false,
    autoCreateDir = true,
    warnOnError = false,
    extension = '.hl7',
    format = 'string',
    filename = '$MSH-10.1',
  }: IDBStoreOptions = {}) {
    this.overwrite = overwrite
    this.append = append
    this.autoCreateDir = autoCreateDir
    this.warnOnError = warnOnError
    this.filename = filename
    this.extension = extension
    this.format = format
    this.path = path
  }
  public store: StoreFunc = async (data) => {
    const dirname = this.path
      .map((p) => {
        if (p.charAt(0) === '$') {
          return data.get(p.slice(1))?.toString() ?? ''
        }
        return p
      })
      .filter((p) => p !== '')
      .join('/')
    if (typeof this.filename === 'string') this.filename = [this.filename]
    const filename =
      typeof this.filename === 'function'
        ? this.filename(data)
        : this.filename
            .map((n) => {
              return n === 'UUID'
                ? randomUUID()
                : n.match(/^\$[A-Z][A-Z0-9]{2}/)
                ? ((data.get(n.slice(1)) ?? '') as string)
                : n
            })
            .join('')
    const fullPath = `${dirname}/${filename}${this.extension}`
    if (this.autoCreateDir && !fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true })
    }
    if (!this.overwrite && !this.append && fs.existsSync(fullPath)) {
      if (this.warnOnError) {
        console.warn(
          `Options set to not overwrite and not append, but the file: ${fullPath} already exists`
        )
      } else {
        throw new Error(
          `Options set to not overwrite and not append, but the file: ${fullPath} already exists`
        )
      }
    }
    const contents =
      this.format === 'string' ? data.toString() : JSON.stringify(data.raw())
    fs.writeFile(
      fullPath,
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
          console.log(`file written to ${fullPath}`)
        }
      }
    )
  }
}

export default DBStore
