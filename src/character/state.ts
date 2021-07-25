import { matchSorter } from "match-sorter"
import { observable } from "mobx"
import { useCallback } from "react"
import { raise } from "../common/raise"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"
import { useIdentity, useUserActions, useUserCharacterNames } from "../user"
import type { Character, Friendship } from "./types"

const store = observable({
	characters: {} as Dict<Character>,
	friendships: [] as Friendship[],
	bookmarks: {} as TruthyMap,
	ignoredUsers: {} as TruthyMap,
	admins: {} as TruthyMap,

	getCharacter: (name: string) =>
		(store.characters[name] ??= createCharacter(name)),
})

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "offline",
		statusMessage: "",
	}
}

export function usePresentCharacters(names: string[]) {
	return names
		.map(store.getCharacter)
		.filter((char) => char.status !== "offline")
}

export function useCharacter(name: string): Character {
	return store.getCharacter(name)
}

export function useFriendships(): Friendship[] {
	return store.friendships
}

export function useFriendCharacters(): readonly Character[] {
	return usePresentCharacters(store.friendships.map((f) => f.them))
}

export function useBookmarkCharacters(): readonly Character[] {
	return usePresentCharacters(Object.keys(store.bookmarks))
}

export function useSearchedCharacters(query: string) {
	const characters = Object.values(store.characters)
	const queryTrimmed = query.trim()

	if (!queryTrimmed) {
		return []
	}

	return matchSorter(characters, queryTrimmed, {
		keys: ["name", "gender", "status"],
	})
}

export function useGetCharacterRoles() {
	return useCallback(
		(name: string) => ({
			isFriend: store.friendships.some(({ them }) => them === name),
			isBookmarked: store.bookmarks[name] ?? false,
			isIgnored: store.ignoredUsers[name] ?? false,
			isAdmin: store.admins[name] ?? false,
		}),
		[],
	)
}

export function useCharacterRoles(name: string) {
	const getCharacterRoles = useGetCharacterRoles()
	return getCharacterRoles(name)
}

// liked characters are the list of bookmarks and friends
export function useLikedCharacters(): readonly Character[] {
	const identity = useIdentity()

	const names = [
		...Object.keys(store.bookmarks),
		...store.friendships.map(({ them }) => them),
	]

	return usePresentCharacters(unique(names).filter((name) => name !== identity))
}

export function useUserCharacters() {
	const names = useUserCharacterNames()
	const identity = useIdentity()
	return names.map(store.getCharacter).filter((char) => char.name !== identity)
}

export function useCharacterCommandListener() {
	const identity = useIdentity()
	const { getFriendsAndBookmarks } = useUserActions()

	useSocketListener((command: ServerCommand) => {
		matchCommand(command, {
			async IDN() {
				const result = await getFriendsAndBookmarks()

				store.friendships = result.friendlist.map((entry) => ({
					us: entry.source,
					them: entry.dest,
				}))

				store.bookmarks = truthyMap(result.bookmarklist)
			},

			IGN(params) {
				if (params.action === "init" || params.action === "list") {
					store.ignoredUsers = truthyMap(params.characters)
				}
				if (params.action === "add") {
					store.ignoredUsers[params.character] = true
				}
				if (params.action === "delete") {
					delete store.ignoredUsers[params.character]
				}
			},

			ADL({ ops }) {
				store.admins = truthyMap(ops)
			},

			AOP({ character }) {
				store.admins[character] = true
			},

			DOP({ character }) {
				delete store.admins[character]
			},

			LIS({ characters }) {
				for (const [name, gender, status, statusMessage] of characters) {
					store.characters[name] = { name, gender, status, statusMessage }
				}
			},

			NLN({ identity: name, gender, status }) {
				store.characters[name] = { name, gender, status, statusMessage: "" }
			},

			FLN({ character: name }) {
				const char = store.getCharacter(name)
				char.status = "offline"
				char.statusMessage = ""
			},

			STA({ character: name, status, statusmsg }) {
				const char = store.getCharacter(name)
				char.status = status
				char.statusMessage = statusmsg
			},

			RTB(params) {
				if (params.type === "trackadd") {
					store.bookmarks[params.name] = true
					// show toast
				}

				if (params.type === "trackrem") {
					delete store.bookmarks[params.name]
					// show toast
				}

				if (params.type === "friendadd") {
					store.friendships.push({
						us: identity ?? raise("not logged in"),
						them: params.name,
					})
					// show toast
				}

				if (params.type === "friendremove") {
					store.friendships = store.friendships.filter(
						(f) => f.them !== params.name,
					)
					// show toast
				}
			},
		})
	})
}
