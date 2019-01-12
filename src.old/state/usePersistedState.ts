import * as idb from "idb-keyval"
import { useEffect, useRef, useState } from "react"
import { tuple } from "../helpers/tuple"

function usePersistedState<T>(key: string, defaultValue: T) {
  const ready = useRef(false)
  const [value, setValue] = useState(defaultValue)

  async function loadValue() {
    try {
      const keys = await idb.keys()
      const value = keys.includes(key) ? await idb.get<T>(key) : defaultValue
      setValue(value)
    } catch {}
    ready.current = true
  }

  useEffect(() => {
    loadValue()
  }, [])

  useEffect(
    () => {
      if (ready.current) idb.set(key, value)
    },
    [value],
  )

  return tuple(value, setValue)
}

export default usePersistedState
