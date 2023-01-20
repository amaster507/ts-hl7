import Surreal from 'surrealdb.js'
import { Credentials } from './surreal.config'

// Install SurrealDB: https://surrealdb.com/install

class DBStore {
  public db: Surreal
  constructor(uri: string) {
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
      await this.db.signin(Credentials)

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
      await this.db.signin(Credentials)

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
