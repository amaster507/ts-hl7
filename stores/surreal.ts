import { env } from 'process'
import Surreal from 'surrealdb.js'

// Install SurrealDB: https://surrealdb.com/install

interface ICredentials {
  user: string
  pass: string
}

const { user, pass } = {
  user: env.SURREALDB_USER,
  pass: env.SURREALDB_PASS,
}

class DBStore {
  public db: Surreal
  private credentials: ICredentials
  constructor(uri: string, credentials?: ICredentials) {
    if (credentials !== undefined) {
      this.credentials = credentials
    } else if (!user || !pass) {
      throw new Error('Missing credentials for SurrealDB')
    } else {
      this.credentials = { user, pass }
    }
    this.db = new Surreal(uri)
  }
  public store = async <T extends Record<string, unknown>>(
    data: T,
    table = 'test',
    namespace = 'test',
    database = 'test',
    id?: string
  ) => {
    try {
      await this.db.signin(this.credentials)

      await this.db.use(namespace, database)
      const identifier = id ? `${table}:⟨${id}⟩` : table
      // if (id) {
      //   await this.db.delete(identifier)
      // }
      const created = await this.db.create(identifier, data)
      console.log(`Created ID: ${created.id} in ${namespace}:${database}`)
      // console.log(JSON.stringify(created))
    } catch (error) {
      console.warn(error)
    }
  }

  public update = async <T extends Record<string, unknown> | undefined>(
    namespace = 'test',
    database = 'test',
    table = 'test',
    id: string,
    update: T
  ) => {
    try {
      await this.db.signin(this.credentials)

      await this.db.use(namespace, database)
      const identifier = `${table}:⟨${id}⟩`
      const created = await this.db.update(identifier, update)
      console.log(`Updated ID: ${created.id} in ${namespace}:${database}`)
    } catch (error) {
      console.warn(error)
    }
  }
}

export default DBStore
