import { Draft } from "immer"
import { useImmer } from "use-immer"
import { Dictionary, Mutable } from "../common/types"

function useFactoryMap<T>(factory: (id: string) => T) {
  const [items, updateAll] = useImmer<Dictionary<T>>({})

  function get(id: string) {
    const item = items[id]
    if (item) return item

    const newItem = factory(id)
    updateAll((items) => {
      items[id] = newItem as Draft<T>
    })
    return newItem
  }

  function set(id: string, newItem: T) {
    updateAll((items) => {
      items[id] = newItem as Draft<T>
    })
  }

  function update(id: string, updater: (channel: Mutable<T>) => T | void) {
    updateAll((items) => {
      const item = items[id] || factory(id)
      items[id] = (updater(item as T) || item) as Draft<T>
    })
  }

  return { items, get, set, update, updateAll }
}
export default useFactoryMap
