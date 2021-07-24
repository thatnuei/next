import { matchSorter } from "match-sorter"
import { useCallback, useMemo } from "react"
import { proxy, useSnapshot } from "valtio"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import type { AuthUser } from "../flist/types"
import { createSimpleContext } from "../react/createSimpleContext"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { FriendsAndBookmarksResponse } from "../user/types"
import type { Character, Friendship } from "./types"

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "offline",
		statusMessage: "",
	}
}

export function createCharacterStore({
	identity,
	user,
	getFriendsAndBookmarks,
}: {
	identity: string
	user: AuthUser
	getFriendsAndBookmarks: () => Promise<FriendsAndBookmarksResponse>
}) {
	const state = proxy({
		characters: {} as Dict<Character>,
		friendships: [] as Friendship[],
		bookmarks: {} as TruthyMap,
		ignoredUsers: {} as TruthyMap,
		admins: {} as TruthyMap,
	})

	const getPresentCharacters = (
		characters: Dict<Character>,
		names: string[],
	): Character[] =>
		names
			.map((name) => characters[name])
			.filter((it): it is Character => it?.status !== "offline")

	function useGetCharacterRoles() {
		const { admins, bookmarks, friendships, ignoredUsers } = useSnapshot(state)

		return useCallback(
			(name: string) => ({
				isFriend: friendships.some((friendship) => friendship.them === name),
				isBookmark: bookmarks[name] ?? false,
				isAdmin: admins[name] ?? false,
				isIgnored: ignoredUsers[name] ?? false,
			}),
			[admins, bookmarks, friendships, ignoredUsers],
		)
	}

	function useFriendCharacters(): Character[] {
		const snapshot = useSnapshot(state)
		return getPresentCharacters(
			snapshot.characters,
			snapshot.friendships.map(({ them }) => them),
		)
	}

	function useBookmarkCharacters(): Character[] {
		const snapshot = useSnapshot(state)
		return getPresentCharacters(
			snapshot.characters,
			Object.keys(snapshot.bookmarks),
		)
	}

	return {
		useCharacter(name: string): Character {
			const fallback = useMemo(() => createCharacter(name), [name])
			return useSnapshot(state).characters[name] ?? fallback
		},

		useFriendCharacters,
		useBookmarkCharacters,

		useLikedCharacters(): Character[] {
			const { friendships, bookmarks, characters } = useSnapshot(state)

			const names = [
				...friendships.map(({ them }) => them),
				...Object.keys(bookmarks),
				...user.characters,
			]

			return getPresentCharacters(
				characters,
				unique(names).filter((names) => names !== identity),
			)
		},

		useSearchedCharacters(query: string): Character[] {
			const snapshot = useSnapshot(state)

			const characters = Object.values(snapshot.characters).filter(
				(char) => char.status !== "offline",
			)

			return matchSorter(characters, query, {
				keys: ["name", "gender", "status"],
			})
		},

		useFriendships(): Friendship[] {
			const snapshot = useSnapshot(state)
			return snapshot.friendships
		},

		useGetCharacterRoles,
		useCharacterRoles(name: string) {
			const getRoles = useGetCharacterRoles()
			return getRoles(name)
		},

		handleSocketCommand(command: ServerCommand) {
			matchCommand(command, {
				async IDN() {
					const result = await getFriendsAndBookmarks()

					state.friendships = result.friendlist.map((entry) => ({
						us: entry.source,
						them: entry.dest,
					}))

					state.bookmarks = truthyMap(result.bookmarklist)
				},

				IGN(params) {
					if (params.action === "init" || params.action === "list") {
						state.ignoredUsers = truthyMap(params.characters)
					}
					if (params.action === "add") {
						state.ignoredUsers[params.character] = true
					}
					if (params.action === "delete") {
						delete state.ignoredUsers[params.character]
					}
				},

				LIS({ characters }) {
					for (const [name, gender, status, statusMessage] of characters) {
						state.characters[name] = { name, gender, status, statusMessage }
					}
				},

				NLN({ identity: name, gender, status }) {
					state.characters[name] = { name, gender, status, statusMessage: "" }
				},

				FLN({ character: name }) {
					const char = (state.characters[name] ??= createCharacter(name))
					char.status = "offline"
					char.statusMessage = ""
				},

				STA({ character: name, status, statusmsg }) {
					const char = (state.characters[name] ??= createCharacter(name))
					char.status = status
					char.statusMessage = statusmsg
				},

				RTB(params) {
					if (params.type === "trackadd") {
						state.bookmarks[params.name] = true
					}

					if (params.type === "trackrem") {
						delete state.bookmarks[params.name]
					}

					if (params.type === "friendadd") {
						state.friendships.push({
							us: identity,
							them: params.name,
						})
						// show notification
					}

					if (params.type === "friendremove") {
						state.friendships = state.friendships.filter(
							(f) => f.them !== params.name,
						)
						// show toast
					}
				},

				AOP({ character }) {
					state.admins[character] = true
				},

				DOP({ character }) {
					delete state.admins[character]
				},
			})
		},
	}
}

export const [CharacterStoreProvider, useCharacterStore] = createSimpleContext(
	"CharacterStore",
	createCharacterStore,
)
