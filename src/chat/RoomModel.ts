import { observable } from "micro-observables"
import { MessageState } from "../message/MessageState"

const messageLimit = 300

export abstract class RoomModel {
	private readonly _messages = observable<MessageState[]>([])
	readonly messages = this._messages.readOnly()

	readonly chatInput = observable("")
	readonly isUnread = observable(false)

	addMessage = (message: MessageState) => {
		this._messages.update((messages) => {
			return [...messages, message].slice(-messageLimit)
		})
	}

	clearMessages = () => {
		this._messages.set([])
	}
}
