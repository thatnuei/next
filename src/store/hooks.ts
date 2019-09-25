import { createHook } from "overmind-react"
import { config, StoreState } from "./index"

export const useStore = createHook<typeof config>()

export function useSelector<T>(getValue: (state: StoreState) => T) {
  const { state } = useStore()
  return getValue(state)
}
