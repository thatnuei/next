import { observable } from "micro-observables"
import React, { useContext } from "react"
import { memoize } from "../helpers/common/memoize"

export class Repository {
  state = memoize(<T>(_key: string, defaultValue: T) =>
    observable(defaultValue),
  )

  namespace = (prefix: string) => <T>(key: string, defaultValue: T) =>
    this.state(`${prefix}:${key}`, defaultValue)
}

const Context = React.createContext(new Repository())
export const RepositoryProvider = Context.Provider
export const useRepository = () => useContext(Context)
