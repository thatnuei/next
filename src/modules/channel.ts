import { observable } from "micro-observables"
import { createCommandHandler } from "./chat-command"
import { repository } from "./helpers/repository"
import { setImmutableDelete } from "./helpers/setImmutableDelete"
import { SocketHandler } from "./socket"

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
	users = observable(new Set<string>())
}

export class ChannelStore {
	constructor(
		private readonly identity: string,
		private readonly socket: SocketHandler,
	) {}

	joinedChannels = observable(new Set<string>())

	getChannel = repository((id) => new Channel(id))

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
			const channel = this.getChannel(id)
			channel.title.set(title)
			channel.users.update((users) => new Set([...users, name]))

			if (name === this.identity) {
				this.joinedChannels.update((channels) => new Set([...channels, id]))
			}
		},

		LCH: ({ channel: id, character: name }) => {
			const channel = this.getChannel(id)
			channel.users.update(setImmutableDelete(name))

			if (name === this.identity) {
				this.joinedChannels.update(setImmutableDelete(id))
			}
		},

		FLN: ({ character }) => {
			for (const channel of this.getChannel.values()) {
				channel.users.update(setImmutableDelete(character))
			}
		},
	})
}
