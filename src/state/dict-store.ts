import type { Dict } from "../common/types"
import { createStore } from "./store"

export function createDictStore<Value>(fallback: (key: string) => Value) {
  const source = createStore<Dict<Value>>({})

  const store = {
    ...source,

    // getters aren't carried over
    get value() {
      return source.value
    },

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

    deleteItem(key: string) {
      source.update((items) => {
        const { [key]: deleted, ...rest } = items
        return rest
      })
    },

    hasKey(key: string) {
      return key in source.value
    },

    hasValue(value: Value) {
      return Object.values(source.value).includes(value)
    },

    selectItem(key: string) {
      return source.select((items) => items[key] ?? fallback(key))
    },

    selectMaybeItem(key: string) {
      return source.select((items) => items[key])
    },

    selectKeys() {
      return source.select(Object.keys)
    },

    selectValues() {
      return source.select<Value[]>(Object.values)
    },
  }

  return store
}
