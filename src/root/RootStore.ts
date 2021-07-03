import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { SocketHandler } from "../socket/SocketHandler"
import { StatusUpdateStore } from "../statusUpdate/StatusUpdateStore"

export class RootStore {
	readonly socket = new SocketHandler()
	readonly userStore = new UserStore()
	readonly appStore = new AppStore(this.socket, this.userStore)
	readonly channelStore = new ChannelStore(
		this.socket,
		this.userStore.userData,
		this.appStore.identity,
	)
	readonly privateChatStore = new PrivateChatStore(
		this.socket,
		this.appStore.identity,
	)
	readonly statusUpdateStore = new StatusUpdateStore(this.socket, this.appStore)
}
