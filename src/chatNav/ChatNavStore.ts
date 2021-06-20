import { observable } from "micro-observables"
import type { ChannelStore } from "../channel/ChannelStore"
import type { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { createBoundCommandHandler } from "../socket/helpers"
import type { SocketHandler } from "../socket/SocketHandler"
import { VisibleState } from "../state/VisibleState"

interface ChatNavView {
	channelId?: string
	privateChatPartner?: string
}

export class ChatNavStore {
	private readonly viewMutable = observable<ChatNavView>({})
	readonly view = this.viewMutable.readOnly()

	readonly sideMenu = new VisibleState()

	constructor(
		private readonly socket: SocketHandler,
		private readonly channelStore: ChannelStore,
		private readonly privateChatStore: PrivateChatStore,
	) {
		this.socket.commands.subscribe(this.handleCommand)
	}

	showChannel = (channelId: string) => {
		this.viewMutable.set({ channelId })
		this.channelStore.getChannel(channelId).isUnread.set(false)
	}

	showPrivateChat = (privateChatPartner: string) => {
		this.viewMutable.set({ privateChatPartner })
		this.privateChatStore.getChat(privateChatPartner).isUnread.set(false)
		this.privateChatStore.open(privateChatPartner)
	}

	private handleCommand = createBoundCommandHandler(this, {
		MSG({ channel: channelId }) {
			if (this.view.get().channelId !== channelId) {
				this.channelStore.getChannel(channelId).isUnread.set(true)
			}
		},
		PRI({ character }) {
			if (this.view.get().privateChatPartner !== character) {
				this.privateChatStore.getChat(character).isUnread.set(true)
			}
		},
	})
}
