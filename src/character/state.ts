import * as jotai from "jotai"
import * as jotaiUtils from "jotai/utils"
import { useCallback } from "react"
import { useAuthUser } from "../chat/authUserContext"
import { useIdentity } from "../chat/identityContext"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { Dict, Mutable, TruthyMap } from "../common/types"
import { unique } from "../common/unique"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { Character, CharacterGender, Friendship } from "./types"

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "online",
		statusMessage: "",
	}
}

export const charactersAtom = jotai.atom<Dict<Character>>({})

export const characterAtom = jotaiUtils.atomFamily((name: string) =>
	jotai.atom((get) => get(charactersAtom)[name] ?? createCharacter(name)),
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

const likedCharactersSelector = jotaiUtils.atomFamily((account: string) => {
	return jotai.atom((get): readonly Character[] => {
		const friendships = get(friendshipsAtom(account))
		const friendCharacters = unique(friendships.map(({ them }) => them)).map(
			(name) => get(characterAtom(name)),
		)

		const bookmarks = get(bookmarksAtom(account))
		const bookmarkCharacters = Object.entries(bookmarks)
			.filter(([, value]) => value)
			.map(([name]) => get(characterAtom(name)))

		return [...friendCharacters, ...bookmarkCharacters]
	})
})

export function useCharacter(name: string): Character {
	return jotai.useAtom(characterAtom(name))[0]
}

export function useCharacterGender(name: string): CharacterGender {
	return jotai.useAtom(characterGenderAtom(name))[0]
}

export function useGetCharacterRoles() {
	const identity = useIdentity()
	const { account } = useAuthUser()

	const [friendships] = jotai.useAtom(friendshipsAtom(identity))
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
	return jotai.useAtom(likedCharactersSelector(useAuthUser().account))[0]
}

export function useCharacterCommandHandler() {
	const user = useAuthUser()
	const identity = useIdentity()

	return jotaiUtils.useAtomCallback(
		useCallback(
			(get, set, command: ServerCommand) => {
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
							set(bookmarksAtom(user.account), (prev) =>
								omit(prev, [params.name]),
							)
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
			[identity, user.account],
		),
	)
}
