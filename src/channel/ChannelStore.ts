import type { Observable } from "micro-observables"
import { observable } from "micro-observables"
import { concatUnique } from "../common/concatUniq"
import { factoryFrom } from "../common/factoryFrom"
import { memoize } from "../common/memoize"
import { unique } from "../common/unique"
import { without } from "../common/without"
import type { AuthUser } from "../flist/types"
import {
	createAdMessage,
	createChannelMessage,
	createSystemMessage,
} from "../message/MessageState"
import { createBoundCommandHandler } from "../socket/helpers"
import type { SocketHandler } from "../socket/SocketHandler"
import { ChannelModel } from "./ChannelModel"
import { loadChannels, saveChannels } from "./storage"

export class ChannelStore {
	private readonly joinedChannelIds = observable<string[]>([])

	constructor(
		private readonly socket: SocketHandler,
		private readonly userData: Observable<AuthUser>,
		private readonly identity: Observable<string>,
	) {
		socket.commands.subscribe(this.handleCommand)

		this.joinedChannelIds.onChange((ids) => {
			saveChannels(ids, userData.get().account, identity.get())
		})
	}

	getChannel = memoize(factoryFrom(ChannelModel))

	joinedChannels = () =>
		this.joinedChannelIds.transform((ids) => ids.map(this.getChannel))

	join = (channelId: string, title?: string) => {
		if (this.joinedChannelIds.get().includes(channelId)) return

		this.socket.send({ type: "JCH", params: { channel: channelId } })

		this.getChannel(channelId).title.update((current) => title ?? current)
	}

	leave = (channelId: string) => {
		this.socket.send({ type: "LCH", params: { channel: channelId } })
	}

	isJoined = (channelId: string) =>
		this.joinedChannelIds.transform((ids) => ids.includes(channelId))

	sendMessage = (channelId: string, text: string) => {
		this.socket.send({
			type: "MSG",
			params: { channel: channelId, message: text },
		})

		const newMessage = createChannelMessage(this.identity.get(), text)
		this.getChannel(channelId).addMessage(newMessage)
	}

	handleCommand = createBoundCommandHandler(this, {
		async IDN() {
			this.joinedChannelIds.set([])

			const { account } = this.userData.get()
			const identity = this.identity.get()
			const channelIds = await loadChannels(account, identity)

			if (channelIds.length === 0) {
				// root.channelBrowserStore.show()
			} else {
				for (const id of channelIds) this.join(id)
			}
		},

		JCH({ channel: id, character: { identity: name }, title }) {
			if (name === this.identity.get()) {
				this.joinedChannelIds.update(concatUnique(id))
			}

			const channel = this.getChannel(id)
			channel.title.set(title)
			channel.users.update(concatUnique(name))
		},

		LCH({ channel: id, character }) {
			if (character === this.identity.get()) {
				this.joinedChannelIds.update(without.curried(id))
			}

			const channel = this.getChannel(id)
			channel.users.update(without.curried(character))
		},

		ICH({ channel: id, users, mode }) {
			const channel = this.getChannel(id)
			channel.users.set(unique(users.map((it) => it.identity)))
			channel.mode.set(mode)
		},

		CDS({ channel: id, description }) {
			const channel = this.getChannel(id)
			channel.description.set(description)
		},

		COL({ channel: id, oplist }) {
			const channel = this.getChannel(id)
			channel.ops.set(oplist)
		},

		MSG({ channel: id, character, message }) {
			const channel = this.getChannel(id)
			channel.addMessage(createChannelMessage(character, message))
		},

		LRP({ channel: id, character, message }) {
			const channel = this.getChannel(id)
			channel.addMessage(createAdMessage(character, message))
		},

		RLL(params) {
			if ("channel" in params) {
				const { channel: id, message } = params
				const channel = this.getChannel(id)
				channel.addMessage(createSystemMessage(message))
			}
		},
	})
}
