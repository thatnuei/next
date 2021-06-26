import { useState } from "react"
import type { AuthUser } from "../flist/types"
import { useRunnableEffect } from "../react/useRunnableEffect"
import { socketUrl } from "../socket/constants"
import type { ClientCommand } from "../socket/helpers"
import { createCommandString, parseServerCommand } from "../socket/helpers"

export function useSocketConnection(user: AuthUser, identity: string) {
	const [status, setStatus] = useState<
		"offline" | "connecting" | "identifying" | "online" | "error" | "closed"
	>("offline")

	const reconnect = useRunnableEffect(() => {
		setStatus("connecting")

		const socket = new WebSocket(socketUrl)

		function send(command: ClientCommand) {
			socket.send(createCommandString(command))
		}

		socket.onopen = () => {
			setStatus("identifying")
			send({
				type: "IDN",
				params: {
					account: user.account,
					ticket: user.ticket,
					character: identity,
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

			// this.commands.publish(command)
		}

		return () => {
			socket.onopen = null
			socket.onclose = null
			socket.onerror = null
			socket.onmessage = null
			socket.close()
		}
	}, [identity, user.account, user.ticket])

	return { status, reconnect }
}
