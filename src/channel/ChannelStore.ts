import { observable } from "micro-observables"
import { createCommandHandler } from "../chat/chatCommand"
import { SocketHandler } from "../chat/SocketHandler"
import { ImmutableSet } from "../helpers/ImmutableSet"
import { repository } from "../helpers/repository"

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
	users = observable(ImmutableSet.of<string>())
}

export class ChannelStore {
	constructor(
		private readonly identity: string,
		private readonly socket: SocketHandler,
	) {}

	joinedChannels = observable(ImmutableSet.of<string>())

	getChannel = repository(id => new Channel(id))

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
			channel.users.update(users => users.add(name))

			if (name === this.identity) {
				this.joinedChannels.update(channels => channels.add(id))
			}
		},

		LCH: ({ channel: id, character: name }) => {
			const channel = this.getChannel(id)
			channel.users.update(users => users.delete(name))

			if (name === this.identity) {
				this.joinedChannels.update(ids => ids.delete(id))
			}
		},

		FLN: ({ character }) => {
			for (const channel of this.getChannel.values()) {
				channel.users.update(users => users.delete(character))
			}
		},
	})
}
