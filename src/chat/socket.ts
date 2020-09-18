import { useCallback, useEffect, useRef, useState } from "react"
import { useEffectRef } from "../react/useEffectRef"
import { ClientCommand, parseCommandString, ServerCommand } from "./chatCommand"

type SocketStatus =
	| "idle"
	| "connecting"
	| "identifying"
	| "online"
	| "closed"
	| "error"
	| "no-session"

export function useSocket(
	account: string,
	ticket: string,
	character: string,
	onCommand: (command: ServerCommand) => void,
) {
	const socketRef = useRef<WebSocket>()
	const [status, setStatus] = useState<SocketStatus>("idle")
	const onCommandRef = useEffectRef(onCommand)

	const send = useCallback((command: ClientCommand) => {
		const message = command.params
			? `${command.type} ${JSON.stringify(command.params)}`
			: command.type

		socketRef.current?.send(message)
	}, [])

	const disconnect = useCallback((newStatus: SocketStatus = "closed") => {
		setStatus(newStatus)

		const socket = socketRef.current
		if (!socket) return
		socket.onopen = null
		socket.onmessage = null
		socket.onclose = null
		socket.onerror = null
		socket.close()
	}, [])

	useEffect(() => {
		setStatus("connecting")

		const socket = (socketRef.current = new WebSocket(
			`wss://chat.f-list.net/chat2`,
		))

		socket.onopen = () => {
			setStatus("identifying")
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

		socket.onmessage = event => {
			const command = parseCommandString(String(event.data))

			if (command.type === "IDN") {
				setStatus("online")
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

			onCommandRef.current(command)
		}

		socket.onclose = () => {
			setStatus("closed") // disconnected from server
		}

		socket.onerror = () => {
			setStatus("error") // failed to connect, network error
		}

		return disconnect
	}, [account, character, disconnect, onCommandRef, send, ticket])

	return { status, send, disconnect }
}
