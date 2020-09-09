import { observable } from "micro-observables"
import { storedUserSession } from "../auth/session"
import { storedIdentity } from "../auth/stored-identity"
import {
	ClientCommand,
	parseCommandString,
	ServerCommand,
} from "./socket-command"

type SocketStatus =
	| "idle"
	| "connecting"
	| "identifying"
	| "online"
	| "closed"
	| "error"
	| "no-session"

export class SocketHandler {
	readonly status = observable<SocketStatus>("idle")
	private socket?: WebSocket

	onCommand = (command: ServerCommand) => {}

	send(command: ClientCommand) {
		const message = command.params
			? `${command.type} ${JSON.stringify(command.params)}`
			: command.type

		this.socket?.send(message)
	}

	async connect() {
		const status = this.status.get()
		if (status !== "idle" && status !== "closed") return

		const session = await storedUserSession.get()
		if (!session) return this.status.set("no-session")

		const identity = await storedIdentity(session.account).get()
		if (!identity) return this.status.set("no-session")

		this.status.set("connecting")

		const socket = (this.socket = new WebSocket(`wss://chat.f-list.net/chat2`))

		socket.onopen = () => {
			this.status.set("identifying")
			this.send({
				type: "IDN",
				params: {
					method: "ticket",
					account: session.account,
					ticket: session.ticket,
					character: identity,
					cname: "next",
					cversion: "0.0.0",
				},
			})
		}

		socket.onmessage = (event) => {
			const command = parseCommandString(String(event.data))
			if (command.type === "IDN") {
				this.status.set("online")
			}
			if (command.type === "PIN") {
				this.send({ type: "PIN" })
			}
			if (command.type === "HLO") {
				console.info(command.params.message)
			}
			if (command.type === "CON") {
				console.info(`There are ${command.params.count} characters in chat`)
			}
			if (command.type === "ERR") {
				// identification failed, probably due to expired ticket
				if (command.params.number === 4) {
					console.log("wat")
					this.status.set("no-session")
					this.disconnect()
				}
			}
			this.onCommand(command)
		}

		socket.onclose = () => {
			this.status.set("closed") // disconnected from server
		}

		socket.onerror = () => {
			this.status.set("error") // failed to connect, network error
		}
	}

	disconnect() {
		if (!this.socket) return
		this.socket.onopen = null
		this.socket.onmessage = null
		this.socket.onclose = null
		this.socket.onerror = null
		this.socket.close()
	}
}
