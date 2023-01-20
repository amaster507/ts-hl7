/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as T
  }
  if (target instanceof Array) {
    const cp = [] as unknown[]
    ;(target as unknown[]).forEach((v) => {
      cp.push(v)
    })
    return cp.map((n: unknown) => deepCopy(n)) as T
  }
  if (typeof target === 'object') {
    if (Object.keys(target).length === 0) return {} as T
    const cp = { ...(target as { [key: string]: unknown }) } as {
      [key: string]: unknown
    }
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy(cp[k])
    })
    return cp as T
  }
  return target
}
