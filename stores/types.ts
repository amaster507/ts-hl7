import Msg from '../src'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreFunc = (data: Msg, id?: string) => Promise<void>

export interface StoreOption {
  id?: string
}
