import React, { useContext } from "react"
import { useInstanceValue } from "../react/useInstanceValue"
import { ToastStore } from "./ToastStore"

const Context = React.createContext(new ToastStore())

export function ToastStoreProvider(props: { children: React.ReactNode }) {
	const store = useInstanceValue(() => new ToastStore())
	return <Context.Provider value={store}>{props.children}</Context.Provider>
}

export function useToastStoreContext() {
	return useContext(Context)
}
