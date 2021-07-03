import type { ReactNode } from "react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { useAuthUser } from "../chat/authUserContext"
import { useIdentity } from "../chat/identityContext"
import { useEffectRef } from "../react/useEffectRef"
import { socketUrl } from "./constants"
import type { ClientCommand, ServerCommand } from "./helpers"
import { createCommandString, parseServerCommand } from "./helpers"

export type SocketConnectionStatus =
	| "offline"
	| "connecting"
	| "identifying"
	| "online"
	| "error"
	| "closed"

export function SocketConnection({
	onCommand,
	children,
}: {
	onCommand: (command: ServerCommand) => void
	children: ReactNode
}) {
	const identity = useIdentity()
	const user = useAuthUser()

	const [status, setStatus] = useState<SocketConnectionStatus>("offline")
	const statusRef = useEffectRef(status)

	const socketRef = useRef<WebSocket>()
	const onCommandRef = useEffectRef(onCommand)

	const send = useCallback((command: ClientCommand) => {
		socketRef.current?.send(createCommandString(command))
	}, [])

	const connect = useCallback(() => {
		const status = statusRef.current
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

			onCommandRef.current(command)
		}
	}, [identity, onCommandRef, send, statusRef, user.account, user.ticket])

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

	useEffect(() => connect(), [connect, identity, user.account, user.ticket])
	useEffect(() => () => disconnect(), [disconnect])

	return (
		<SocketStatusContext.Provider value={status}>
			<ConnectContext.Provider value={connect}>
				<SendCommandContext.Provider value={send}>
					{children}
				</SendCommandContext.Provider>
			</ConnectContext.Provider>
		</SocketStatusContext.Provider>
	)
}

export const SocketStatusContext =
	createContext<SocketConnectionStatus>("offline")
export const ConnectContext = createContext(() => {})
const SendCommandContext = createContext((command: ClientCommand) => {})

export function useSendCommand() {
	return useContext(SendCommandContext)
}
