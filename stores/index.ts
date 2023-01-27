import surreal from './surreal'
import file from './file'
// import dgraph from './dgraph'

// TODO: add more stores,
// TODO: move stores and server outo of this package.

/**
 * To add your own db store do the following:
 * 1. Create a new file for your store in the stores folder
 * 2. Create a new class for your store
 * 3. Create a public 'store' function should take the following parameters:
 *    - data: T extends Record<string, unknown>
 *    - table?: string
 *    - namespace?: string
 *    - database?: string
 *    - id?: string
 * 4. Create a public 'update' function should take the following parameters:
 *    - data: T extends Record<string, unknown>
 *    - table?: string
 *    - namespace?: string
 *    - database?: string
 *    - id: string
 * 5. Import your store Class into this file
 * 6. Add your store to the export object
 */

const stores = {
  surreal,
  file,
  // dgraph,
  // mongo,
  // postgres,
  // mysql,
}

export type Store = keyof typeof stores

export default stores
