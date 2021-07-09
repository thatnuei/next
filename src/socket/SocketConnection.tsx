import type { ReactNode } from "react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import { useNotificationActions } from "../notifications/state"
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

type CommandListener = (command: ServerCommand) => void

interface SocketActions {
	connect: (identity: string) => void
	disconnect: () => void
	send: (command: ClientCommand) => void
	addListener: (listener: CommandListener) => void
	callListeners: (command: ServerCommand) => void
}

export const ActionsContext = createContext<SocketActions>()
export const SocketStatusContext =
	createContext<SocketConnectionStatus>("offline")

export function SocketConnection({ children }: { children: ReactNode }) {
	const { getFreshAuthCredentials } = useAuthUserContext()
	const { addNotification } = useNotificationActions()

	const [status, setStatus] = useState<SocketConnectionStatus>("offline")
	const statusRef = useEffectRef(status)

	const socketRef = useRef<WebSocket>()
	const listeners = useRef(new Set<CommandListener>())

	const send = useCallback((command: ClientCommand) => {
		socketRef.current?.send(createCommandString(command))
	}, [])

	const addListener = useCallback((listener: CommandListener) => {
		listeners.current.add(listener)
		return () => {
			listeners.current.delete(listener)
		}
	}, [])

	const callListeners = useCallback((command: ServerCommand) => {
		listeners.current.forEach((listener) => listener(command))
	}, [])

	const connect = useCallback(
		(identity: string) => {
			const status = statusRef.current
			if (status !== "offline" && status !== "error" && status !== "closed") {
				return
			}

			setStatus("connecting")

			const socket = (socketRef.current = new WebSocket(socketUrl))

			socket.onopen = async () => {
				const result = await getFreshAuthCredentials().catch(toError)
				if (result instanceof Error) {
					setStatus("error")
					addNotification({
						type: "error",
						message: result.message,
						showToast: true,
						save: false,
					})
					return
				}

				send({
					type: "IDN",
					params: {
						...result,
						character: identity,
						cname: "next",
						cversion: "0.0.0",
						method: "ticket",
					},
				})
				setStatus("identifying")
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

				callListeners(command)
			}
		},
		[callListeners, getFreshAuthCredentials, send, addNotification, statusRef],
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

	const actions = useMemo(
		() => ({
			addListener,
			connect,
			disconnect,
			send,
			callListeners,
		}),
		[addListener, callListeners, connect, disconnect, send],
	)

	return (
		<SocketStatusContext.Provider value={status}>
			<ActionsContext.Provider value={actions}>
				{children}
			</ActionsContext.Provider>
		</SocketStatusContext.Provider>
	)
}

export function useSocketActions() {
	return useContext(ActionsContext) ?? raise("ActionsContext not found")
}

export function useSocketListener(listener: CommandListener) {
	const { addListener } = useSocketActions()
	return useEffect(() => addListener(listener))
}
