import { createContext, useContext } from "react"
import { RootStore } from "./RootStore"

const Context = createContext(new RootStore())
export const RootStoreProvider = Context.Provider
export const useRootStore = () => useContext(Context)
