import * as idb from "idb-keyval"
import { useEffect, useState } from "react"
import { tuple } from "../helpers/tuple"

function usePersistedState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    idb
      .keys()
      .then((keys) => (keys.includes(key) ? idb.get<T>(key) : defaultValue))
      .then(setValue)
  }, [])

  useEffect(
    () => {
      idb.set(key, value)
    },
    [value],
  )

  return tuple(value, setValue)
}

export default usePersistedState
