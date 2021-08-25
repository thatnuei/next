import type { Getter, Setter, WritableAtom } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { useCallback } from "react"

/**
 * A typesafe convenience wrapper around useAtomCallback.
 * Returns a function to arbitrarily update an atom
 */
export function useUpdateAtomFn() {
  type CallbackArg = {
    atom: WritableAtom<any, any>
    update: any
  }

  const callback = useAtomCallback(
    useCallback((_: Getter, set: Setter, arg: CallbackArg) => {
      set(arg.atom, arg.update)
    }, []),
  )

  return useCallback(
    <Update>(atom: WritableAtom<any, Update>, update: Update) => {
      callback({ atom, update }).catch(() => {
        console.warn("failed to update atom", atom, update)
      })
    },
    [callback],
  )
}
