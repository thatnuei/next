import { createHook } from "overmind-react"
import { config, State } from "./index"

export const useStore = createHook<typeof config>()

export function useSelector<T>(getValue: (state: State) => T) {
  const { state } = useStore()
  return getValue(state)
}
