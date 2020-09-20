import { observable } from "micro-observables"
import { observableSet } from "../helpers/observable"
import { ChannelMessage } from "./types"

export class ChannelModel {
	readonly id
	title
	description
	messages
	private usersSet

	constructor(id: string, title = id) {
		this.id = id
		this.title = observable<string>(title)
		this.description = observable<string>("")
		this.messages = observable<ChannelMessage[]>([])
		this.usersSet = observableSet<string>()
	}

	get users() {
		return this.usersSet.values
	}

	addUser(name: string) {
		this.usersSet.add(name)
	}

	removeUser(name: string) {
		this.usersSet.remove(name)
	}
}
