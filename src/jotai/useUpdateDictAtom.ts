import type { WritableAtom } from "jotai"
import { useUpdateAtom } from "jotai/utils"
import type { SetStateAction } from "react"
import { useCallback } from "react"
import type { Dict } from "../common/types"

export function useUpdateDictAtom<T>(
  dictAtom: WritableAtom<Dict<T>, SetStateAction<Dict<T>>>,
  fallback: (key: string) => T,
) {
  const updateDict = useUpdateAtom(dictAtom)
  return useCallback(
    (key: string, action: SetStateAction<T>) => {
      updateDict((dict) => ({
        ...dict,
        [key]:
          typeof action === "function"
            ? (action as (value: T) => T)(dict[key] ?? fallback(key))
            : action,
      }))
    },
    [updateDict, fallback],
  )
}
