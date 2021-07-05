import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { SocketHandler } from "../socket/SocketHandler"

export class RootStore {
	readonly socket = new SocketHandler()
	readonly userStore = new UserStore()
	readonly appStore = new AppStore(this.socket, this.userStore)
	readonly privateChatStore = new PrivateChatStore(
		this.socket,
		this.appStore.identity,
	)
}
