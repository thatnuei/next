import { createContext, useContext } from "react"
import { raise } from "../common/raise"

const noValue = Symbol("noValue")

export function createSimpleContext<T>(name: string) {
  const Context = createContext<T | typeof noValue>(noValue)

  function useOptionalValue(): T | undefined {
    const value = useContext(Context)
    return value === noValue ? undefined : value
  }

  function useValue(): T {
    const value = useContext(Context)
    return value === noValue
      ? raise(`Missing provider for simple context "${name}"`)
      : value
  }

  return {
    Provider: Context.Provider,
    useOptionalValue,
    useValue,
  }
}
