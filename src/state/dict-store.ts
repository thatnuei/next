import type { Dict } from "../common/types"
import { createStore } from "./store"

export function createDictStore<Value>(fallback: (key: string) => Value) {
  const source = createStore<Dict<Value>>({})

  const store = {
    ...source,

    getItem(key: string) {
      return source.value[key]
    },

    setItem(key: string, value: Value) {
      source.update((items) => ({ ...items, [key]: value }))
    },

    updateItem(key: string, updater: (value: Value) => Value) {
      source.update((items) => {
        const value = items[key] ?? fallback(key)
        return { ...items, [key]: updater(value) }
      })
    },

    selectItem(key: string) {
      return source.select((items) => items[key] ?? fallback(key))
    },
  }

  return store
}
