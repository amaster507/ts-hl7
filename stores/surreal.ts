import { env } from 'process'
import Surreal, { Auth } from 'surrealdb.js'
import Msg from '../src'
import { StoreFunc, StoreOption } from './types'

// Install SurrealDB: https://surrealdb.com/install

export interface IDBStoreOptions extends StoreOption {
  uri: string
  user?: string
  pass?: string
  warnOnError?: boolean
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
  private warnOnError: boolean
  constructor({ uri, user, pass, warnOnError = false }: IDBStoreOptions) {
    this.warnOnError = warnOnError
    user = user ?? envUser
    pass = pass ?? envPpass
    if (!user || !pass) {
      throw new Error('Missing credentials for SurrealDB')
    } else {
      this.credentials = { user, pass }
    }
    this.db = new Surreal(uri)
  }
  public store: StoreFunc = async (data, id?: string) => {
    try {
      await this.db.signin(this.credentials)

      await this.db.use(namespace, database)
      const identifier = id ? `${table}:⟨${id}⟩` : table
      const contents = { meta: data.raw()[0], msg: data.raw()?.[1] }
      const created = await this.db.create(identifier, contents)
      if (verbose)
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
