import type { Atom } from "jotai"
import { atom, useAtom } from "jotai"
import { atomFamily, useAtomValue, useUpdateAtom } from "jotai/utils"
import { matchSorter } from "match-sorter"
import { useCallback, useMemo } from "react"
import { isPresent } from "../common/isPresent"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
import { truthyMap } from "../common/truthyMap"
import type { Dict, Mutable, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateDictAtom } from "../jotai/useUpdateDictAtom"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"
import { useIdentity, useUserActions, useUserCharacters } from "../user"
import type { Character, CharacterGender, Friendship } from "./types"

const characterDictAtom = atom<Dict<Character>>({})

export const characterAtom = dictionaryAtomFamily(
	characterDictAtom,
	createCharacter,
)

const characterGenderAtom = atomFamily((name: string) => {
	return atom((get) => {
		const character = get(characterAtom(name))
		return character.gender
	})
})

const friendshipsAtom = atom<readonly Friendship[]>([])
const bookmarksAtom = atom<TruthyMap>({})
const ignoredUsersAtom = atom<TruthyMap>({})
const adminsAtom = atom<TruthyMap>({})

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "offline",
		statusMessage: "",
	}
}

export function useCharacter(name: string): Character {
	return useAtom(characterAtom(name))[0]
}

export function useCharacterGender(name: string): CharacterGender {
	return useAtom(characterGenderAtom(name))[0]
}

export function useFriendCharacters(): readonly Character[] {
	return useAtomValue(
		useMemo(() => {
			return atom((get) => {
				const friends = get(friendshipsAtom)
				const characters = get(characterDictAtom)
				return unique(
					friends
						.map(({ them }) => characters[them])
						.filter(isPresent)
						.filter((character) => character.status !== "offline"),
				)
			})
		}, []),
	)
}

export function useBookmarkCharacters(): readonly Character[] {
	return useAtomValue(
		useMemo(() => {
			return atom((get) => {
				const bookmarks = get(bookmarksAtom)
				const characters = get(characterDictAtom)
				return unique(
					Object.keys(bookmarks)
						.map((name) => characters[name])
						.filter(isPresent)
						.filter((character) => character.status !== "offline"),
				)
			})
		}, []),
	)
}

export function useSearchedCharacters(queryAtom: Atom<string>) {
	return useAtomValue(
		useMemo(() => {
			return atom<readonly Character[]>((get) => {
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
	const [friendships] = useAtom(friendshipsAtom)
	const [bookmarks] = useAtom(bookmarksAtom)
	const [ignoredUsers] = useAtom(ignoredUsersAtom)
	const [admins] = useAtom(adminsAtom)

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
	const characters = useUserCharacters()
	const identity = useIdentity()

	const likedCharactersAtom = useMemo(
		() =>
			atom((get): readonly Character[] => {
				const friendships = get(friendshipsAtom)
				const bookmarks = get(bookmarksAtom)

				const names = [
					...Object.keys(bookmarks),
					...friendships.map(({ them }) => them),
					...characters, // including self characters can be helpful for testing
				]

				return unique(names)
					.filter((name) => name !== identity)
					.map((name) => get(characterAtom(name)))
			}),
		[identity, characters],
	)

	return useAtomValue(likedCharactersAtom)
}

export function useCharacterCommandListener() {
	const identity = useIdentity()
	const setCharacterDict = useUpdateAtom(characterDictAtom)
	const updateCharacterDict = useUpdateDictAtom(
		characterDictAtom,
		createCharacter,
	)
	const setFriendships = useUpdateAtom(friendshipsAtom)
	const setBookmarks = useUpdateAtom(bookmarksAtom)
	const setIgnoredUsers = useUpdateAtom(ignoredUsersAtom)
	const setAdmins = useUpdateAtom(adminsAtom)
	const { getFriendsAndBookmarks } = useUserActions()

	useSocketListener((command: ServerCommand) => {
		matchCommand(command, {
			async IDN() {
				const result = await getFriendsAndBookmarks()

				const friends = result.friendlist.map((entry) => ({
					us: entry.source,
					them: entry.dest,
				}))

				setFriendships(friends)
				setBookmarks(truthyMap(result.bookmarklist))
			},

			IGN(params) {
				if (params.action === "init" || params.action === "list") {
					setIgnoredUsers(truthyMap(params.characters))
				}
				if (params.action === "add") {
					setIgnoredUsers((prev) => ({
						...prev,
						[params.character]: true,
					}))
				}
				if (params.action === "delete") {
					setIgnoredUsers((prev) => omit(prev, [params.character]))
				}
			},

			ADL({ ops }) {
				setAdmins(truthyMap(ops))
			},

			LIS({ characters }) {
				const newCharacters: Mutable<Dict<Character>> = {}
				for (const [name, gender, status, statusMessage] of characters) {
					newCharacters[name] = { name, gender, status, statusMessage }
				}
				setCharacterDict((prev) => ({ ...prev, ...newCharacters }))
			},

			NLN({ identity: name, gender, status }) {
				updateCharacterDict(name, () => ({
					name,
					gender,
					status,
					statusMessage: "",
				}))
			},

			FLN({ character: name }) {
				updateCharacterDict(name, (prev) => ({
					...prev,
					status: "offline",
					statusMessage: "",
				}))
			},

			STA({ character: name, status, statusmsg }) {
				updateCharacterDict(name, (prev) => ({
					...prev,
					status,
					statusMessage: statusmsg,
				}))
			},

			RTB(params) {
				if (params.type === "trackadd") {
					setBookmarks((prev) => ({
						...prev,
						[params.name]: true,
					}))
					// show toast
				}

				if (params.type === "trackrem") {
					setBookmarks((prev) => omit(prev, [params.name]))
					// show toast
				}

				if (params.type === "friendadd") {
					setFriendships((prev) => [
						...prev,
						{ us: identity ?? raise("not logged in"), them: params.name },
					])
					// show toast
				}

				if (params.type === "friendremove") {
					setFriendships((prev) => {
						return prev.filter((entry) => entry.them !== params.name)
					})
					// show toast
				}
			},
		})
	})
}
