import { Dictionary } from "../types"

export default function createFactoryUpdate<V>(
  collection: Dictionary<V>,
  createNew: (key: string) => V,
) {
  return function updateInCollection(
    key: string,
    updateItem: (item: V) => V | void,
  ) {
    let item = collection[key]
    if (!item) {
      item = collection[key] = createNew(key)
    }

    const updateResult = updateItem(item)
    if (updateResult) {
      collection[key] = updateResult
    }
  }
}
