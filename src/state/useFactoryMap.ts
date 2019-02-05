import produce from "immer"
import { useMemo, useState } from "react"
import exists from "../common/exists"
import { Dictionary } from "../common/types"

export type FactoryMapState<T> = {
  items: Dictionary<T>
  get: (id: string) => T
  set: (id: string, newItem: T) => void
  merge: (newItems: Record<string, T>) => void
  update: (id: string, update: (item: T) => T | void) => void
  keys: string[]
  values: T[]
}

function useFactoryMap<T>(factory: (id: string) => T): FactoryMapState<T> {
  const [items, setItems] = useState<Dictionary<T>>({})

  function get(id: string) {
    const item = items[id]
    if (item) return item

    const newItem = factory(id)
    setItems({ ...items, [id]: newItem })
    return newItem
  }

  function set(id: string, newItem: T) {
    setItems({ ...items, [id]: newItem })
  }

  function merge(newItems: Record<string, T>) {
    setItems({ ...items, ...newItems })
  }

  function update(id: string, update: (item: T) => T | void) {
    const item = get(id)
    setItems({ ...items, [id]: produce(item, update) as T })
  }

  const keys = useMemo(() => Object.keys(items), [items])

  const values = useMemo(() => Object.values(items).filter(exists), [items])

  return { items, get, set, merge, update, keys, values }
}
export default useFactoryMap
