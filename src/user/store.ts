import { pick } from "lodash-es"
import { toError } from "../common/toError"
import { authenticate } from "../flist/authenticate"
import { fetchFlist } from "../flist/fetchFlist"
import type { AuthUser } from "../flist/types"
import type { FriendsAndBookmarksResponse } from "./types"

const invalidTicketError = /invalid ticket/i

interface Token {
	account: string
	ticket: string
}

export function createUserStore({ user: initialUser }: { user: AuthUser }) {
	let user: AuthUser = initialUser

	/**
	 * Accepts a fetcher function,
	 * then does a refetch if the fetch failed with an
	 * invalid token error
	 */
	async function fetchWithValidToken<T>(
		doFetch: (token: Token) => Promise<T>,
	): Promise<T> {
		const token = pick(user, ["account", "ticket"])
		const result = await doFetch(token).catch(toError)

		if (!(result instanceof Error)) {
			return result
		}

		if (invalidTicketError.test(result.message)) {
			const newUser = await authenticate(pick(user, ["account", "password"]))
			user = newUser
			return await doFetch(pick(newUser, ["account", "ticket"]))
		}

		throw result
	}

	return {
		addBookmark: (name: string) =>
			fetchWithValidToken((token) =>
				fetchFlist(`/api/bookmark-add.php`, { name, ...token }),
			),

		removeBookmark: (name: string) =>
			fetchWithValidToken((token) =>
				fetchFlist(`/api/bookmark-remove.php`, { name, ...token }),
			),

		getFriendsAndBookmarks: () =>
			fetchWithValidToken((token) =>
				fetchFlist<FriendsAndBookmarksResponse>(
					`/api/friend-bookmark-lists.php`,
					{
						...token,
						friendlist: "true",
						bookmarklist: "true",
					},
				),
			),

		getMemo: async (name: string) => {
			return fetchWithValidToken(async (token) => {
				const res = await fetchFlist<{ note: string | null }>(
					"/api/character-memo-get2.php",
					{ ...token, target: name },
				)
				return res.note || ""
			})
		},

		setMemo: async (name: string, note: string) => {
			return fetchWithValidToken((token) => {
				return fetchFlist("/api/character-memo-save.php", {
					...token,
					target_name: name,
					note,
				})
			})
		},
	}
}
