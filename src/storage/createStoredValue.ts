import type { Validator } from "../validation"
import { keyValueStore } from "./keyValueStore"

export function createStoredValue<V>(key: string, validator: Validator<V>) {
  const get = async (): Promise<V> =>
    validator.parse(await keyValueStore.get(key))
  const set = (value: V): Promise<void> => keyValueStore.set(key, value)
  const del = (): Promise<void> => keyValueStore.delete(key)

  const update = (
    doUpdate: (data: V) => V,
    createNew: () => V,
  ): Promise<void> =>
    get().then(validator.parse).catch(createNew).then(doUpdate).then(set)

  return {
    get,
    set,
    delete: del,
    update,
  }
}
