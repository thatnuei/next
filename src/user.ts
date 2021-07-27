import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { pick } from "lodash-es"
import { useMemo } from "react"
import { clearStoredStatus } from "./chat/StatusRestorationEffect"
import { raise } from "./common/raise"
import { authenticate } from "./flist/authenticate"
import { fetchFlist } from "./flist/fetchFlist"
import type { AuthUser, LoginCredentials } from "./flist/types"
import { useEffectRef } from "./react/useEffectRef"
import { routes } from "./router"

interface FriendsAndBookmarksResponse {
	readonly friendlist: ReadonlyArray<{
		/** our character */
		source: string
		/** their character */
		dest: string
	}>
	readonly bookmarklist: readonly string[]
}

let user: AuthUser | undefined

const ticketExpireTime = 1000 * 60 * 5
let lastTicketFetchTime = Date.now()

const identityAtom = atom<string | undefined>(undefined)
const accountAtom = atom<string | undefined>(undefined)
const userCharactersAtom = atom<readonly string[]>([])

export function useIdentity(): string | undefined {
	return useAtomValue(identityAtom)
}

export function useAccount(): string | undefined {
	return useAtomValue(accountAtom)
}

export function useUserCharacterNames(): readonly string[] {
	return useAtomValue(userCharactersAtom)
}

export function useUserActions() {
	const setIdentityAtom = useUpdateAtom(identityAtom)
	const setUserCharacters = useUpdateAtom(userCharactersAtom)
	const setAccount = useUpdateAtom(accountAtom)
	const identityRef = useEffectRef(useIdentity())

	return useMemo(() => {
		async function login(creds: LoginCredentials) {
			user = await authenticate(creds)
			setAccount(user.account)
			setUserCharacters(user.characters)
		}

		async function getFreshAuthCredentials() {
			if (!user) raise("Not logged in")

			if (Date.now() - lastTicketFetchTime > ticketExpireTime) {
				lastTicketFetchTime = Date.now()
				await login(pick(user, ["account", "password"]))
			}

			return pick(user, ["account", "ticket"])
		}

		return {
			getFreshAuthCredentials,

			async submitLogin(creds: LoginCredentials) {
				await login(creds)
			},

			logout() {
				if (identityRef.current) {
					clearStoredStatus(identityRef.current)
				}
				setIdentityAtom(undefined)
				setAccount(undefined)
				setUserCharacters([])
				user = undefined
				routes.login().push()
			},

			setIdentity(identity: string) {
				setIdentityAtom(identity)
			},

			addBookmark: async (args: { name: string }) => {
				const creds = await getFreshAuthCredentials()
				await fetchFlist(`/api/bookmark-add.php`, { ...args, ...creds })
			},

			removeBookmark: async (args: { name: string }) => {
				const creds = await getFreshAuthCredentials()
				await fetchFlist(`/api/bookmark-remove.php`, { ...args, ...creds })
			},

			getFriendsAndBookmarks: async () => {
				const creds = await getFreshAuthCredentials()
				return fetchFlist<FriendsAndBookmarksResponse>(
					`/api/friend-bookmark-lists.php`,
					{
						...creds,
						friendlist: "true",
						bookmarklist: "true",
					},
				)
			},

			getMemo: async (args: { name: string }) => {
				const creds = await getFreshAuthCredentials()
				const res = await fetchFlist<{ note: string | null }>(
					"/api/character-memo-get2.php",
					{ ...creds, target: args.name },
				)
				return res.note ?? ""
			},

			setMemo: async ({ name, ...params }: { name: string; note: string }) => {
				const creds = await getFreshAuthCredentials()
				await fetchFlist("/api/character-memo-save.php", {
					...creds,
					...params,
					target_name: name,
				})
			},
		}
	}, [setAccount, setIdentityAtom, setUserCharacters])
}
