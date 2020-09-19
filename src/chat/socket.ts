import { ref } from "reactivue"
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

export function createSocketHandler() {
	const status = ref<SocketStatus>("idle")
	const listeners = new Set<CommandHandler>()
	let socket: WebSocket | undefined

	function send(command: ClientCommand) {
		const message = command.params
			? `${command.type} ${JSON.stringify(command.params)}`
			: command.type

		socket?.send(message)
	}

	function connect(options: ConnectOptions) {
		status.value = "connecting"

		socket = new WebSocket(`wss://chat.f-list.net/chat2`)

		socket.onopen = () => {
			status.value = "identifying"

			const { account, ticket, character } = options
			send({
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

		socket.onmessage = (event) => {
			const command = parseCommandString(String(event.data))

			if (command.type === "IDN") {
				status.value = "online"
			}

			if (command.type === "PIN") {
				send({ type: "PIN" })
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
					disconnect("no-session")
				}
			}

			listeners.forEach((h) => h(command))
		}

		socket.onclose = () => {
			status.value = "closed" // disconnected from server
		}

		socket.onerror = () => {
			status.value = "error" // failed to connect, network error
		}
	}

	function disconnect(newStatus: SocketStatus = "closed") {
		status.value = newStatus

		if (!socket) return
		socket.onopen = null
		socket.onmessage = null
		socket.onclose = null
		socket.onerror = null
		socket.close()
	}

	function listen(listener: CommandHandler) {
		listeners.add(listener)
		return () => {
			listeners.delete(listener)
		}
	}

	function removeListeners() {
		listeners.clear()
	}

	return { send, connect, disconnect, listen, removeListeners, status }
}
