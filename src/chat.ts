import { ChannelStore } from "./channel"
import { CharacterStore } from "./character"
import { SocketHandler } from "./socket"

export class ChatStore {
	socket = new SocketHandler()
	characterStore = new CharacterStore()
	channelStore = new ChannelStore(this.identity, this.socket)
	currentChannel?: string

	constructor(private readonly identity: string) {
		this.socket.onCommand = (cmd) => {
			this.characterStore.handleCommand(cmd)
			this.channelStore.handleCommand(cmd)
		}
	}
}
