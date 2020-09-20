import { observable } from "micro-observables"
import { ClientCommand, parseCommandString, ServerCommand } from "./chatCommand"

type SocketStatus =
	| "idle"
	| "connecting"
	| "identifying"
	| "online"
	| "closed"
	| "error"
	| "no-session"

type ConnectOptions = {
	account: string
	ticket: string
	character: string
}

type CommandHandler = (command: ServerCommand) => void

export class SocketHandler {
	status = observable<SocketStatus>("idle")
	listeners = new Set<CommandHandler>()
	socket?: WebSocket

	connect(options: ConnectOptions) {
		const status = this.status.get()
		if (status !== "idle" && status !== "closed" && status !== "error") return

		this.status.set("connecting")

		this.socket = new WebSocket(`wss://chat.f-list.net/chat2`)

		this.socket.onopen = () => {
			this.status.set("identifying")

			const { account, ticket, character } = options
			this.send({
				type: "IDN",
				params: {
					account,
					ticket,
					character,
					cname: "next",
					cversion: "0.0.0",
					method: "ticket",
				},
			})
		}

		this.socket.onmessage = (event) => {
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
					this.disconnect("no-session")
				}
			}

			this.listeners.forEach((h) => h(command))
		}

		this.socket.onclose = () => {
			this.status.set("closed") // disconnected from server
		}

		this.socket.onerror = () => {
			this.status.set("error") // failed to connect, network error
		}
	}

	disconnect(newStatus: SocketStatus = "closed") {
		this.status.set(newStatus)

		if (!this.socket) return
		this.socket.onopen = null
		this.socket.onmessage = null
		this.socket.onclose = null
		this.socket.onerror = null
		this.socket.close()
	}

	send(command: ClientCommand) {
		const message = command.params
			? `${command.type} ${JSON.stringify(command.params)}`
			: command.type

		this.socket?.send(message)
	}

	listen(listener: CommandHandler) {
		this.listeners.add(listener)
		return () => {
			this.listeners.delete(listener)
		}
	}

	removeListeners() {
		this.listeners.clear()
	}
}
