import { useCallback } from "react"
import { queryCache, useQuery } from "react-query"
import { createIdbStorage } from "./storage/idb"

export type UserSession = {
	account: string
	ticket: string
}

const storedSession = createIdbStorage<UserSession>("session")

export function useSessionQuery() {
	const query = useQuery("session", () => storedSession.get(), {
		suspense: true,
	})

	const setData = useCallback((data: UserSession) => {
		queryCache.setQueryData("session", data)
	}, [])

	return { ...query, setData }
}

const storedIdentity = createIdbStorage<string>("identity")

export function useIdentityQuery() {
	const query = useQuery("identity", () => storedIdentity.get(), {
		suspense: true,
	})

	const setData = useCallback((data: string) => {
		queryCache.setQueryData("identity", data)
	}, [])

	return { ...query, setData }
}

// const emptySession: UserSession = {
// 	account: "",
// 	ticket: "",
// 	characters: [],
// 	identity: "",
// }

// const UserSessionContext = React.createContext(emptySession)

// export function UserSessionProvider() {
// 	const [session, setSession] = useState<UserSession>()

// }

// export function useUserSession() {}
