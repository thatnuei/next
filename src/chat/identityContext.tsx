import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { raise } from "../common/raise"

const Context = createContext<string>()

interface IdentityProviderProps {
	identity: string
	children: ReactNode
}

export function IdentityProvider({
	identity,
	children,
}: IdentityProviderProps) {
	return <Context.Provider value={identity}>{children}</Context.Provider>
}

export function useIdentity() {
	return useContext(Context) ?? raise("IdentityProvider not found")
}
