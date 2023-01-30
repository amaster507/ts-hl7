import Msg from '../src'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreFunc = (data: Msg, id?: string) => Promise<void>

/**
 * @param id - When defined in the Store Config, this id prop accepts a HL7 reference like `$MSH-10.1`. Or can also use `UUID` to generate a universally unique identifier.
 * @ignore Some stores may not support externally assigned identifiers, so then `id` should simply be ignored.
 * @todo Support multiple HL7 references in a formatted reference like `${MSH-9.1}_${MSH-10-1}`
 */
export interface StoreOption {
  id?: string
}
