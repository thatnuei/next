import { RecoilState, useRecoilCallback } from "recoil"

/**
 * Returns the `set` function in a recoil callback.
 * More convenient than a direct useRecoilCallback in lots of cases
 */
export function useRecoilSet() {
  return useRecoilCallback(
    <T>(
      // @ts-expect-error
      { set },
      atom: RecoilState<T>,
      valOrUpdater: T | ((currVal: T) => T),
    ) => {
      set(atom, valOrUpdater)
    },
  )
}
