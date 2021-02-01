import { observable } from "micro-observables"
import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { concatUnique } from "../common/concatUniq"
import { memoize } from "../common/memoize"
import { without } from "../common/without"
import { createBoundCommandHandler } from "../socket/helpers"
import { SocketHandler } from "../socket/SocketHandler"
import { CharacterModel } from "./CharacterModel"

type Friendship = {
	us: string
	them: string
}

export class CharacterStore {
	readonly friends = observable<readonly Friendship[]>([])
	readonly bookmarks = observable<readonly string[]>([])
	readonly ignored = observable<readonly string[]>([])
	readonly admins = observable<readonly string[]>([])

	constructor(
		socket: SocketHandler,
		private readonly userStore: UserStore,
		private readonly appStore: AppStore,
	) {
		socket.commands.subscribe(this.handleCommand)
	}

	private getCharacterById = memoize((id: string, name: string) => {
		return new CharacterModel(id, name)
	})

	getCharacter = (name: string) =>
		this.getCharacterById(name.toLowerCase(), name)

	handleCommand = createBoundCommandHandler(this, {
		async IDN() {
			const result = await this.userStore.getFriendsAndBookmarks()

			const friends = result.friendlist.map((entry) => ({
				us: entry.source,
				them: entry.dest,
			}))

			this.bookmarks.set(result.bookmarklist)
			this.friends.set(friends)
		},

		IGN(params) {
			if (params.action === "init" || params.action === "list") {
				this.ignored.set(params.characters)
			}
			if (params.action === "add") {
				this.ignored.update(concatUnique(params.character))
			}
			if (params.action === "delete") {
				this.ignored.update(without.curried(params.character))
			}
		},

		ADL({ ops }) {
			this.admins.set(ops)
		},

		LIS({ characters }) {
			for (const [name, gender, status, statusMessage] of characters) {
				const char = this.getCharacter(name)
				char.name.set(name)
				char.gender.set(gender)
				char.status.set({ type: status, text: statusMessage })
			}
		},

		NLN({ identity: name, gender, status }) {
			const char = this.getCharacter(name)
			char.name.set(name)
			char.gender.set(gender)
			char.status.set({ type: status, text: "" })
		},

		FLN({ character: name }) {
			const char = this.getCharacter(name)
			char.status.set({ type: "offline", text: "" })
		},

		STA({ character: name, status, statusmsg }) {
			const char = this.getCharacter(name)
			char.status.set({ type: status, text: statusmsg })
		},

		RTB(params) {
			if (params.type === "trackadd") {
				this.bookmarks.update(concatUnique(params.name))
				// show toast
			}

			if (params.type === "trackrem") {
				this.bookmarks.update(without.curried(params.name))
				// show toast
			}

			if (params.type === "friendadd") {
				this.friends.update(
					concatUnique({ us: this.appStore.identity.get(), them: params.name }),
				)
				// show toast
			}

			if (params.type === "friendremove") {
				this.friends.update((friends) =>
					friends.filter((it) => it.them === params.name),
				)
				// show toast
			}
		},
	})
}
