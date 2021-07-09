import { pick } from "lodash-es"
import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useRef, useState } from "react"
import { raise } from "../common/raise"
import { authenticate } from "../flist/authenticate"
import { fetchFlist } from "../flist/fetchFlist"
import type { AuthUser, LoginCredentials } from "../flist/types"
import { useEffectRef } from "../react/useEffectRef"

interface FriendsAndBookmarksResponse {
	readonly friendlist: ReadonlyArray<{
		/** our character */
		source: string
		/** their character */
		dest: string
	}>
	readonly bookmarklist: readonly string[]
}

const ticketExpireTime = 1000 * 60 * 5

function useAuthUserProvider() {
	const [user, setUser] = useState<AuthUser>()
	const lastTicketFetchTime = useRef(Date.now())

	const login = useCallback(async (creds: LoginCredentials) => {
		setUser(await authenticate(creds))
	}, [])

	const logout = useCallback(() => {
		setUser(undefined)
	}, [])

	const userRef = useEffectRef(user)
	const getFreshAuthCredentials = useCallback(async () => {
		let user = userRef.current ?? raise("Not logged in")

		if (Date.now() - lastTicketFetchTime.current > ticketExpireTime) {
			lastTicketFetchTime.current = Date.now()
			user = await authenticate(pick(user, ["account", "password"]))
			setUser(user)
		}

		return pick(user, ["account", "ticket"])
	}, [userRef])

	const addBookmark = useCallback(
		async (args: { name: string }) => {
			const creds = await getFreshAuthCredentials()
			await fetchFlist(`/api/bookmark-add.php`, { ...args, ...creds })
		},
		[getFreshAuthCredentials],
	)

	const removeBookmark = useCallback(
		async (args: { name: string }) => {
			const creds = await getFreshAuthCredentials()
			await fetchFlist(`/api/bookmark-remove.php`, { ...args, ...creds })
		},
		[getFreshAuthCredentials],
	)

	const getFriendsAndBookmarks = useCallback(async () => {
		const creds = await getFreshAuthCredentials()
		return fetchFlist<FriendsAndBookmarksResponse>(
			`/api/friend-bookmark-lists.php`,
			{
				...creds,
				friendlist: "true",
				bookmarklist: "true",
			},
		)
	}, [getFreshAuthCredentials])

	const getMemo = useCallback(
		async (args: { name: string }) => {
			const creds = await getFreshAuthCredentials()
			const res = await fetchFlist<{ note: string | null }>(
				"/api/character-memo-get2.php",
				{ ...creds, target: args.name },
			)
			return res.note ?? ""
		},
		[getFreshAuthCredentials],
	)

	const setMemo = useCallback(
		async ({ name, ...params }: { name: string; note: string }) => {
			const creds = await getFreshAuthCredentials()
			await fetchFlist("/api/character-memo-save.php", {
				...creds,
				...params,
				target_name: name,
			})
		},
		[getFreshAuthCredentials],
	)

	return {
		user,
		getFreshAuthCredentials,
		login,
		logout,
		addBookmark,
		removeBookmark,
		getFriendsAndBookmarks,
		getMemo,
		setMemo,
	}
}

type ContextType = ReturnType<typeof useAuthUserProvider>

const Context = createContext<ContextType>()

export function AuthUserProvider({ children }: { children: ReactNode }) {
	return (
		<Context.Provider value={useAuthUserProvider()}>
			{children}
		</Context.Provider>
	)
}

export function useAuthUserContext() {
	return useContext(Context) ?? raise("AuthUserProvider not found")
}

export function useAuthUser() {
	const context = useAuthUserContext()
	return context.user ?? raise("Not logged in")
}
