import { observable } from "micro-observables"
import { RoomModel } from "../chat/RoomModel"
import type { TypingStatus } from "./types"

export class PrivateChatModel extends RoomModel {
	readonly typingStatus = observable<TypingStatus>("clear")

	constructor(readonly partnerName: string) {
		super()
	}
}
