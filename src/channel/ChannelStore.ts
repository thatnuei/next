import { observable } from "micro-observables"
import { createCommandHandler } from "../chat/chatCommand"
import { SocketHandler } from "../chat/SocketHandler"
import { dictRemove, dictSet } from "../helpers/dict"
import { MapWithDefault } from "../helpers/MapWithDefault"

export type ChannelMessage = {
	senderName: string
	text: string
	time: number
}

export class Channel {
	constructor(readonly id: string) {}
	title = observable(this.id)
	description = observable("")
	messages = observable<ChannelMessage[]>([])
	users = observable<Record<string, true>>({})

	addUser(name: string) {
		this.users.update(dictSet(name, true))
	}

	removeUser(name: string) {
		this.users.update(dictRemove(name))
	}
}

export class ChannelStore {
	constructor(
		private readonly identity: string,
		private readonly socket: SocketHandler,
	) {}

	readonly channels = new MapWithDefault(id => new Channel(id))

	private readonly joinedChannelIdsDict = observable<Record<string, true>>({})

	readonly joinedChannels = this.joinedChannelIdsDict.transform(ids =>
		Object.keys(ids).map(id => this.channels.get(id)),
	)

	handleCommand = createCommandHandler({
		IDN: () => {
			this.socket.send({ type: "JCH", params: { channel: "Frontpage" } })
			this.socket.send({ type: "JCH", params: { channel: "Fantasy" } })
			this.socket.send({ type: "JCH", params: { channel: "Development" } })
			this.socket.send({
				type: "JCH",
				params: { channel: "Story Driven LFRP" },
			})
		},

		JCH: ({ channel: id, title, character: { identity: name } }) => {
			const channel = this.channels.get(id)
			channel.title.set(title)
			channel.addUser(name)

			if (name === this.identity) {
				this.joinedChannelIdsDict.update(dictSet(id, true))
			}
		},

		LCH: ({ channel: id, character: name }) => {
			const channel = this.channels.get(id)
			channel.removeUser(name)

			if (name === this.identity) {
				this.joinedChannelIdsDict.update(dictRemove(id))
			}
		},

		FLN: ({ character }) => {
			for (const channel of this.channels.values()) {
				channel.removeUser(character)
			}
		},
	})
}
