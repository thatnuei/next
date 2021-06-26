import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { raise } from "../common/raise"
import type { AuthUser } from "./types"

const Context = createContext<AuthUser>()

export function FListAuthProvider({
	user,
	children,
}: {
	user: AuthUser
	children: ReactNode
}) {
	return <Context.Provider value={user}>{children}</Context.Provider>
}

export function useFListUser() {
	return useContext(Context) ?? raise("FListAuthProvider not found")
}
