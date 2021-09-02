import { useCallback } from "react"
import { createDictStore } from "../state/dict-store"
import { persistStore, useStoreValue } from "../state/store"
import * as v from "../validation"

const nicknamesStore = createDictStore<string>((name) => name)
persistStore("characterNicknames", v.dictionary(v.string), nicknamesStore)

export function useNickname(characterName: string): string | undefined {
  return useStoreValue(nicknamesStore.selectMaybeItem(characterName))
}

export function useSetNickname(characterName: string) {
  return useCallback(
    (newNickname: string) => nicknamesStore.setItem(characterName, newNickname),
    [characterName],
  )
}

export function useGetNickname() {
  const nicknames = useStoreValue(nicknamesStore)
  return useCallback((name: string) => nicknames[name], [nicknames])
}
