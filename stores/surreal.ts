import { randomUUID } from 'crypto'
import { env } from 'process'
import Surreal, { Auth } from 'surrealdb.js'
import { StoreFunc, StoreOption } from './types'

// Install SurrealDB: https://surrealdb.com/install

export interface IDBStoreOptions extends StoreOption {
  uri?: string
  user?: string
  pass?: string
  warnOnError?: boolean
  verbose?: boolean
  namespace?: string
  database?: string
  table?: string
}

const { envUser, envPpass } = {
  envUser: env.SURREALDB_USER,
  envPpass: env.SURREALDB_PASS,
}

export interface StoreOptions {
  table?: string
  namespace?: string
  database?: string
  verbose?: boolean
}

class DBStore {
  private db: Surreal
  private credentials: Auth
  private warnOnError: NonNullable<IDBStoreOptions['warnOnError']>
  private verbose: NonNullable<IDBStoreOptions['verbose']>
  private namespace: NonNullable<IDBStoreOptions['namespace']>
  private database: NonNullable<IDBStoreOptions['database']>
  private table: NonNullable<IDBStoreOptions['table']>
  private id: NonNullable<IDBStoreOptions['id']>
  constructor({
    uri = 'http://127.0.0.1:8000/rpc',
    user,
    pass,
    warnOnError = false,
    verbose = false,
    namespace = 'test',
    database = 'test',
    table = 'test',
    id = '$MSH-10.1',
  }: IDBStoreOptions = {}) {
    this.warnOnError = warnOnError
    this.verbose = verbose
    this.namespace = namespace
    this.database = database
    this.table = table
    this.id = id
    user = user ?? envUser
    pass = pass ?? envPpass
    if (!user || !pass) {
      throw new Error('Missing credentials for SurrealDB')
    } else {
      this.credentials = { user, pass }
    }
    this.db = new Surreal(uri)
  }
  public store: StoreFunc = async (data) => {
    const namespace = this.namespace.match(/^\$[A-Z][A-Z0-9]{2}/)
      ? (data.get(this.namespace.slice(1) ?? this.namespace) as string)
      : this.namespace
    const database = this.database.match(/^\$[A-Z][A-Z0-9]{2}/)
      ? (data.get(this.database.slice(1) ?? this.database) as string)
      : this.database
    const table = this.table.match(/^\$[A-Z][A-Z0-9]{2}/)
      ? (data.get(this.table.slice(1) ?? this.table) as string)
      : this.table
    const id =
      this.id === 'UUID'
        ? randomUUID()
        : this.id.match(/^\$[A-Z][A-Z0-9]{2}/)
        ? (data.get(this.id.slice(1) ?? randomUUID()) as string)
        : this.table
    try {
      await this.db.signin(this.credentials)

      await this.db.use(namespace, database)
      const identifier = id ? `${table}:⟨${id}⟩` : table
      const contents = { meta: data.raw()[0], msg: data.raw()?.[1] }
      const created = await this.db.create(identifier, contents)
      if (this.verbose)
        console.log(`Created ID: ${created.id} in ${namespace}:${database}`)
    } catch (error) {
      if (this.warnOnError) {
        console.warn(error)
      } else {
        throw new Error(JSON.stringify(error))
      }
    }
  }
}

export default DBStore
