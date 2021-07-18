import * as jotai from "jotai"
import * as jotaiUtils from "jotai/utils"
import { matchSorter } from "match-sorter"
import { useCallback, useMemo } from "react"
import { isPresent } from "../common/isPresent"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
import { truthyMap } from "../common/truthyMap"
import type { Dict, Mutable, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"
import {
	useAccount,
	useIdentity,
	useUserActions,
	useUserCharacters,
} from "../user"
import type { Character, CharacterGender, Friendship } from "./types"

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "offline",
		statusMessage: "",
	}
}

export const characterDictAtom = jotai.atom<Dict<Character>>({})

export const characterAtom = dictionaryAtomFamily(
	characterDictAtom,
	createCharacter,
)

const characterGenderAtom = jotaiUtils.atomFamily((name: string) => {
	return jotai.atom((get) => {
		const character = get(characterAtom(name))
		return character.gender
	})
})

const friendshipsAtom = jotaiUtils.atomFamily((account: string) =>
	jotai.atom<readonly Friendship[]>([]),
)

const bookmarksAtom = jotaiUtils.atomFamily((account: string) =>
	jotai.atom<TruthyMap>({}),
)

const ignoredUsersAtom = jotaiUtils.atomFamily((account: string) =>
	jotai.atom<TruthyMap>({}),
)

const adminsAtom = jotai.atom<TruthyMap>({})

export function useCharacter(name: string): Character {
	return jotai.useAtom(characterAtom(name))[0]
}

export function useCharacterGender(name: string): CharacterGender {
	return jotai.useAtom(characterGenderAtom(name))[0]
}

export function useFriendCharacters(): readonly Character[] {
	const account = useAccount() ?? raise("not logged in")

	return jotaiUtils.useAtomValue(
		useMemo(() => {
			return jotai.atom((get) => {
				const friends = get(friendshipsAtom(account))
				const characters = get(characterDictAtom)
				return unique(
					friends
						.map(({ them }) => characters[them])
						.filter(isPresent)
						.filter((character) => character.status !== "offline"),
				)
			})
		}, [account]),
	)
}

export function useBookmarkCharacters(): readonly Character[] {
	const account = useAccount() ?? raise("not logged in")

	return jotaiUtils.useAtomValue(
		useMemo(() => {
			return jotai.atom((get) => {
				const bookmarks = get(bookmarksAtom(account))
				const characters = get(characterDictAtom)
				return unique(
					Object.keys(bookmarks)
						.map((name) => characters[name])
						.filter(isPresent)
						.filter((character) => character.status !== "offline"),
				)
			})
		}, [account]),
	)
}

export function useSearchedCharacters(queryAtom: jotai.Atom<string>) {
	return jotaiUtils.useAtomValue(
		useMemo(() => {
			return jotai.atom<readonly Character[]>((get) => {
				const query = get(queryAtom).trim().toLowerCase()
				if (!query) return []

				const characters = Object.values(get(characterDictAtom)).filter(
					(character) => character.status !== "offline",
				)

				return matchSorter(characters, query, {
					keys: ["name", "gender", "status"],
				})
			})
		}, [queryAtom]),
	)
}

export function useGetCharacterRoles() {
	const account = useAccount() ?? raise("Not logged in")
	const [friendships] = jotai.useAtom(friendshipsAtom(account))
	const [bookmarks] = jotai.useAtom(bookmarksAtom(account))
	const [ignoredUsers] = jotai.useAtom(ignoredUsersAtom(account))
	const [admins] = jotai.useAtom(adminsAtom)

	return useCallback(
		(name: string) => ({
			friendships,
			isFriend: friendships.some(({ them }) => them === name),
			isBookmarked: bookmarks[name] ?? false,
			isIgnored: ignoredUsers[name] ?? false,
			isAdmin: admins[name] ?? false,
		}),
		[admins, bookmarks, friendships, ignoredUsers],
	)
}
export function useCharacterRoles(name: string) {
	const getCharacterRoles = useGetCharacterRoles()
	return getCharacterRoles(name)
}

// liked characters are the list of bookmarks and friends
export function useLikedCharacters(): readonly Character[] {
	const account = useAccount()
	const characters = useUserCharacters()
	const identity = useIdentity()

	const atom = useMemo(
		() =>
			jotai.atom((get): readonly Character[] => {
				const friendships = account ? get(friendshipsAtom(account)) : []
				const bookmarks = account ? get(bookmarksAtom(account)) : []

				const names = [
					...Object.keys(bookmarks),
					...friendships.map(({ them }) => them),
					...characters, // including self characters can be helpful for testing
				]

				return unique(names)
					.filter((name) => name !== identity)
					.map((name) => get(characterAtom(name)))
			}),
		[identity, account, characters],
	)

	return jotaiUtils.useAtomValue(atom)
}

export function useCharacterCommandListener() {
	const account = useAccount()
	const identity = useIdentity()
	const { getFriendsAndBookmarks } = useUserActions()

	useSocketListener(
		jotaiUtils.useAtomCallback(
			useCallback(
				(get, set, command: ServerCommand) => {
					if (!account || !identity) {
						return
					}

					matchCommand(command, {
						async IDN() {
							const result = await getFriendsAndBookmarks()

							const friends = result.friendlist.map((entry) => ({
								us: entry.source,
								them: entry.dest,
							}))

							set(friendshipsAtom(account), friends)
							set(bookmarksAtom(account), truthyMap(result.bookmarklist))
						},

						IGN(params) {
							const ignoredUsers = ignoredUsersAtom(account)

							if (params.action === "init" || params.action === "list") {
								set(ignoredUsers, truthyMap(params.characters))
							}
							if (params.action === "add") {
								set(
									ignoredUsers,
									(prev): TruthyMap => ({
										...prev,
										[params.character]: true,
									}),
								)
							}
							if (params.action === "delete") {
								set(ignoredUsers, (prev) => omit(prev, [params.character]))
							}
						},

						ADL({ ops }) {
							set(adminsAtom, truthyMap(ops))
						},

						LIS({ characters }) {
							const newCharacters: Mutable<Dict<Character>> = {}
							for (const [name, gender, status, statusMessage] of characters) {
								newCharacters[name] = { name, gender, status, statusMessage }
							}
							set(characterDictAtom, (prev) => ({ ...prev, ...newCharacters }))
						},

						NLN({ identity: name, gender, status }) {
							set(characterDictAtom, (prev) => ({
								...prev,
								[name]: { name, gender, status, statusMessage: "" },
							}))
						},

						FLN({ character: name }) {
							set(
								characterDictAtom,
								(prev): Dict<Character> => ({
									...prev,
									[name]: {
										...(prev[name] ?? createCharacter(name)),
										status: "offline",
										statusMessage: "",
									},
								}),
							)
						},

						STA({ character: name, status, statusmsg }) {
							set(
								characterDictAtom,
								(prev): Dict<Character> => ({
									...prev,
									[name]: {
										...(prev[name] ?? createCharacter(name)),
										status,
										statusMessage: statusmsg,
									},
								}),
							)
						},

						RTB(params) {
							if (params.type === "trackadd") {
								set(
									bookmarksAtom(account),
									(prev): TruthyMap => ({
										...prev,
										[params.name]: true,
									}),
								)
								// show toast
							}

							if (params.type === "trackrem") {
								set(bookmarksAtom(account), (prev) => omit(prev, [params.name]))
								// show toast
							}

							if (params.type === "friendadd") {
								set(friendshipsAtom(identity), (prev) => [
									...prev,
									{ us: identity, them: params.name },
								])
								// show toast
							}

							if (params.type === "friendremove") {
								set(friendshipsAtom(identity), (prev) => {
									return prev.filter((entry) => entry.them !== params.name)
								})
								// show toast
							}
						},
					})
				},
				[getFriendsAndBookmarks, identity, account],
			),
		),
	)
}
