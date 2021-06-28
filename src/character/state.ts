import {
	atom,
	atomFamily,
	selectorFamily,
	useRecoilCallback,
	useRecoilValue,
} from "recoil"
import { useIdentity } from "../chat/identityContext"
import { truthyMap } from "../common/truthyMap"
import type { TruthyMap } from "../common/types"
import type { AuthUser } from "../flist/types"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { Character } from "./types"

const characterAtom = atomFamily({
	key: "character",
	default: createCharacter,
})

const characterGenderSelector = selectorFamily({
	key: "characterGender",
	// prettier-ignore
	get: (name: string) => ({ get }) => get(characterAtom(name)).gender,
})

const friendsAtom = atomFamily({
	key: "friends",
	default: (identity: string): TruthyMap => ({}),
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

function createCharacter(name: string): Character {
	return {
		name,
		gender: "None",
		status: "online",
		statusMessage: "",
	}
}

export function useCharacterCommandHandler() {
	const identity = useIdentity()

	return useRecoilCallback(
		({ set }) =>
			(command: ServerCommand, user: AuthUser) => {
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
							set(ignoredUsers, (prev) => ({
								...prev,
								[params.character]: true,
							}))
						}
						if (params.action === "delete") {
							set(ignoredUsers, (prev) => ({
								...prev,
								[params.character]: undefined,
							}))
						}
					},

					ADL({ ops }) {
						set(adminsAtom, truthyMap(ops))
					},

					LIS({ characters }) {
						for (const [name, gender, status, statusMessage] of characters) {
							set(characterAtom(name), {
								name,
								gender,
								status,
								statusMessage,
							})
						}
					},

					NLN({ identity: name, gender, status }) {
						set(characterAtom(name), {
							name,
							gender,
							status,
							statusMessage: "",
						})
					},

					FLN({ character: name }) {
						set(
							characterAtom(name),
							(char): Character => ({
								...char,
								status: "offline",
								statusMessage: "",
							}),
						)
					},

					STA({ character: name, status, statusmsg }) {
						set(
							characterAtom(name),
							(char): Character => ({
								...char,
								status,
								statusMessage: statusmsg,
							}),
						)
					},

					RTB(params) {
						if (params.type === "trackadd") {
							set(bookmarksAtom(user.account), (prev) => ({
								...prev,
								[params.name]: true,
							}))
							// show toast
						}

						if (params.type === "trackrem") {
							set(bookmarksAtom(user.account), (prev) => ({
								...prev,
								[params.name]: undefined,
							}))
							// show toast
						}

						if (params.type === "friendadd") {
							set(friendsAtom(identity), (prev) => ({
								...prev,
								[params.name]: true,
							}))
							// show toast
						}

						if (params.type === "friendremove") {
							set(friendsAtom(identity), (prev) => ({
								...prev,
								[params.name]: true,
							}))
							// show toast
						}
					},
				})
			},
	)
}

export function useCharacter(name: string) {
	return useRecoilValue(characterAtom(name))
}

export function useCharacterGender(name: string) {
	return useRecoilValue(characterGenderSelector(name))
}

export function useGetCharacter() {
	return useRecoilCallback(({ snapshot }) => (name: string): Character => {
		const loadable = snapshot.getLoadable(characterAtom(name))
		return loadable.valueMaybe() ?? createCharacter(name)
	})
}
