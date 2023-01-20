import surreal from './surreal'
// import dgraph from './dgraph'

// TODO: add more stores,
// TODO: move stores and server outo of this package.

/**
 * To add your own db store do the following:
 * 1. Create a new file for your store function in the stores folder
 * 2. Your store function should take the following parameters:
 *    - data: T extends Record<string, unknown>
 *    - table?: string
 *    - namespace?: string
 *    - database?: string
 *    - id?: string
 * 3. Import your store Class into this file
 * 4. Add your store to the available Store type
 * 5. Add your store to the export object
 */

export type Store = 'surreal' // | 'dgraph'

const stores = {
  surreal,
  // dgraph,
}

export default stores
