import { createCommandHandler } from "../chat/chatCommand"
import { isTruthy } from "../helpers/isTruthy"
import { observableSet } from "../helpers/observable"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
	private channels: Record<string, ChannelModel> = {}
	private joinedIdsSet = observableSet<string>()
	private readonly identity

	constructor(identity: string) {
		this.identity = identity
	}

	get joinedChannels() {
		return this.joinedIdsSet.values.transform((ids) =>
			ids.map((id) => this.channels[id]).filter(isTruthy),
		)
	}

	handleCommand = createCommandHandler({
		JCH: ({ channel: id, title, character: { identity: name } }) => {
			const channel = (this.channels[id] ||= new ChannelModel(id, title))
			channel.title.set(title)
			channel.addUser(name)

			if (name === this.identity) {
				this.joinedIdsSet.add(id)
			}
		},

		LCH: ({ channel: id, character: name }) => {
			const channel = (this.channels[id] ||= new ChannelModel(id))
			channel.removeUser(name)

			if (name === this.identity) {
				this.joinedIdsSet.remove(id)
			}
		},

		FLN: ({ character }) => {
			for (const channel of Object.values(this.channels)) {
				channel.removeUser(character)
			}
		},
	})
}
