import React, { useContext } from "react"
import { RootStore } from "./RootStore"

const Context = React.createContext(new RootStore())
export const RootStoreProvider = Context.Provider
export const useRootStore = () => useContext(Context)
