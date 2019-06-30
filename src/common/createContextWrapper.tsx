import React, { useContext } from "react"

const missingValue = Symbol()

function createContextWrapper<R, I extends object>(hook: (init: I) => R) {
  const Context = React.createContext<R | typeof missingValue>(missingValue)

  function Provider(props: I & { children: React.ReactNode }) {
    const context = hook(props)
    return <Context.Provider value={context}>{props.children}</Context.Provider>
  }

  function useWrappedContext() {
    const context = useContext(Context)
    if (context === missingValue) {
      throw new Error("Missing context provider")
    }
    return context
  }

  return [Provider, useWrappedContext] as const
}

export default createContextWrapper
