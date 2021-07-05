import { useCallback } from "react"
import {
	atom,
	atomFamily,
	selectorFamily,
	useRecoilCallback,
	useRecoilValue,
} from "recoil"
import { useAuthUser } from "../chat/authUserContext"
import { useIdentity } from "../chat/identityContext"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { Dict, Mutable, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { Character, Friendship } from "./types"

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "online",
		statusMessage: "",
	}
}

export const charactersAtom = atom<Dict<Character>>({
	key: "characters",
	default: {},
})

export const characterSelector = selectorFamily({
	key: "character",
	get:
		(name: string) =>
		({ get }): Character =>
			get(charactersAtom)[name] ?? createCharacter(name),
})

const characterGenderSelector = selectorFamily({
	key: "characterGender",
	get:
		(name: string) =>
		({ get }) =>
			get(characterSelector(name)).gender,
})

const friendshipsAtom = atomFamily({
	key: "friends",
	default: (account: string): readonly Friendship[] => [],
})

const bookmarksAtom = atomFamily({
	key: "bookmarks",
	default: (account: string): TruthyMap => ({}),
})

const ignoredUsersAtom = atomFamily({
	key: "ignoredUsers",
	default: (account: string): TruthyMap => ({}),
})

const adminsAtom = atom<TruthyMap>({
	key: "admins",
	default: {},
})

const likedCharactersSelector = selectorFamily({
	key: "likedCharacters",

	get:
		(account: string) =>
		({ get }): readonly Character[] => {
			const friendships = get(friendshipsAtom(account))
			const friendCharacters = unique(friendships.map(({ them }) => them))
				.map(characterSelector)
				.map(get)

			const bookmarks = get(bookmarksAtom(account))
			const bookmarkCharacters = Object.entries(bookmarks)
				.filter(([, value]) => value)
				.map(([name]) => get(characterSelector(name)))

			return [...friendCharacters, ...bookmarkCharacters]
		},
})

export function useCharacter(name: string) {
	return useRecoilValue(characterSelector(name))
}

export function useCharacterGender(name: string) {
	return useRecoilValue(characterGenderSelector(name))
}

export function useGetCharacterRoles() {
	const identity = useIdentity()
	const { account } = useAuthUser()

	const friendships = useRecoilValue(friendshipsAtom(identity))
	const bookmarks = useRecoilValue(bookmarksAtom(account))
	const ignoredUsers = useRecoilValue(ignoredUsersAtom(account))
	const admins = useRecoilValue(adminsAtom)

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
export function useLikedCharacters() {
	return useRecoilValue(likedCharactersSelector(useAuthUser().account))
}

export function useCharacterCommandHandler() {
	const user = useAuthUser()
	const identity = useIdentity()

	return useRecoilCallback(({ set }) => (command: ServerCommand) => {
		matchCommand(command, {
			// async IDN() {
			//   const result = await this.userStore.getFriendsAndBookmarks()

			//   const friends = result.friendlist.map((entry) => ({
			//     us: entry.source,
			//     them: entry.dest,
			//   }))

			//   this.bookmarks.set(result.bookmarklist)
			//   this.friends.set(friends)
			// },

			IGN(params) {
				const ignoredUsers = ignoredUsersAtom(user.account)

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
				set(charactersAtom, (prev) => ({ ...prev, ...newCharacters }))
			},

			NLN({ identity: name, gender, status }) {
				set(charactersAtom, (prev) => ({
					...prev,
					[name]: { name, gender, status, statusMessage: "" },
				}))
			},

			FLN({ character: name }) {
				set(
					charactersAtom,
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
					charactersAtom,
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
						bookmarksAtom(user.account),
						(prev): TruthyMap => ({
							...prev,
							[params.name]: true,
						}),
					)
					// show toast
				}

				if (params.type === "trackrem") {
					set(bookmarksAtom(user.account), (prev) => omit(prev, [params.name]))
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
	})
}
