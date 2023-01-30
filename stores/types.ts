// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreFunc<D extends object, O extends Record<string, any>> = (
  data: D,
  options?: O,
  id?: string
) => Promise<void>

export interface StoreOption {
  id?: string
}
