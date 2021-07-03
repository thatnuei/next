import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { raise } from "../common/raise"
import type { AuthUser } from "../flist/types"

// a provider and hook for passing down an AuthUser object
const Context = createContext<AuthUser>()

export function AuthUserProvider({
	user,
	children,
}: {
	user: AuthUser
	children: ReactNode
}) {
	return <Context.Provider value={user}>{children}</Context.Provider>
}

export function useAuthUser() {
	return useContext(Context) ?? raise("AuthUserProvider not found")
}
