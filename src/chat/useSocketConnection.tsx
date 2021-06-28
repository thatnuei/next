import { useCallback, useRef, useState } from "react"
import { useEffectRef } from "../react/useEffectRef"
import { socketUrl } from "../socket/constants"
import type { ClientCommand, ServerCommand } from "../socket/helpers"
import { createCommandString, parseServerCommand } from "../socket/helpers"

export type SocketConnectionStatus =
	| "offline"
	| "connecting"
	| "identifying"
	| "online"
	| "error"
	| "closed"

export function useSocketConnection({
	onCommand,
}: {
	onCommand: (command: ServerCommand) => void
}) {
	const [status, setStatus] = useState<SocketConnectionStatus>("offline")
	const socketRef = useRef<WebSocket>()
	const onCommandRef = useEffectRef(onCommand)

	function send(command: ClientCommand) {
		socketRef.current?.send(createCommandString(command))
	}

	const connect = useCallback(
		(account: string, ticket: string, character: string) => {
			if (status !== "offline" && status !== "error" && status !== "closed") {
				return
			}

			setStatus("connecting")

			const socket = (socketRef.current = new WebSocket(socketUrl))

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

			socket.onclose = () => {
				setStatus("closed")
			}

			socket.onerror = () => {
				setStatus("error")
			}

			socket.onmessage = ({ data }) => {
				const command = parseServerCommand(data)

				if (command.type === "PIN") {
					send({ type: "PIN" })
					return
				}

				if (command.type === "HLO") {
					console.info(command.params.message)
					return
				}

				if (command.type === "CON") {
					console.info(`There are ${command.params.count} users in chat`)
					return
				}

				if (command.type === "IDN") {
					setStatus("online")
				}

				if (command.type === "ERR") {
					// TODO: show toast
					console.warn("Socket error", command.params.message)
				}

				onCommandRef.current(command)
			}
		},
		[onCommandRef, status],
	)

	const disconnect = useCallback(() => {
		const socket = socketRef.current
		if (!socket) return

		socketRef.current = undefined

		socket.onopen = null
		socket.onclose = null
		socket.onerror = null
		socket.onmessage = null
		socket.close()
	}, [])

	return { status, connect, disconnect }
}
