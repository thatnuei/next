import { observable } from "micro-observables"
import { delay } from "../common/delay"
import { createBoundCommandHandler } from "../socket/helpers"
import type { SocketHandler } from "../socket/SocketHandler"

export interface ChannelBrowserChannel {
	id: string
	title: string
	type: "public" | "private"
	userCount: number
}

export class ChannelBrowserStore {
	readonly isVisible = observable(false)
	readonly isRefreshing = observable(false)
	readonly publicChannels = observable<ChannelBrowserChannel[]>([])
	readonly privateChannels = observable<ChannelBrowserChannel[]>([])

	constructor(private readonly socket: SocketHandler) {
		socket.commands.subscribe(this.handleCommand)

		this.isVisible.onChange((isVisible) => {
			if (isVisible) this.refresh().catch(console.error)
		})
	}

	show = () => this.isVisible.set(true)
	hide = () => this.isVisible.set(false)

	isPublic = (channelId: string) =>
		this.publicChannels.transform((channels) =>
			channels.some((ch) => ch.id === channelId),
		)

	refresh = async () => {
		if (this.isRefreshing.get()) return

		this.socket.send({ type: "CHA" })
		this.socket.send({ type: "ORS" })

		// the server has a 7 second timeout on refreshes
		this.isRefreshing.set(true)
		await delay(7000)
		this.isRefreshing.set(false)
	}

	handleCommand = createBoundCommandHandler(this, {
		IDN() {
			this.refresh().catch(console.error)
		},

		CHA({ channels }) {
			this.publicChannels.set(
				channels.map((it) => ({
					id: it.name,
					title: it.name,
					userCount: it.characters,
					type: "public",
				})),
			)
		},

		ORS({ channels }) {
			this.privateChannels.set(
				channels.map((it) => ({
					id: it.name,
					title: it.title,
					userCount: it.characters,
					type: "private",
				})),
			)
		},
	})
}
