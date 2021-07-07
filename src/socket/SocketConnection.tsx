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
import { useAuthUser, useAuthUserContext } from "../chat/authUserContext"
import { useIdentity } from "../chat/identityContext"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import { useEffectRef } from "../react/useEffectRef"
import { useShowToast } from "../toast/state"
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
	connect: () => void
	disconnect: () => void
	send: (command: ClientCommand) => void
	addListener: (listener: CommandListener) => void
}

export const ActionsContext = createContext<SocketActions>()
export const SocketStatusContext =
	createContext<SocketConnectionStatus>("offline")

export function SocketConnection({ children }: { children: ReactNode }) {
	const identity = useIdentity()
	const user = useAuthUser()
	const { getFreshAuthCredentials } = useAuthUserContext()
	const showToast = useShowToast()

	const [status, setStatus] = useState<SocketConnectionStatus>("offline")
	const statusRef = useEffectRef(status)

	const socketRef = useRef<WebSocket>()
	const listeners = useRef(new Set<CommandListener>())

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

		socket.onopen = async () => {
			const creds = await getFreshAuthCredentials().catch(toError)
			if (creds instanceof Error) {
				setStatus("error")
				showToast({
					type: "error",
					content: creds.message,
					duration: 5000,
				})
				return
			}

			send({
				type: "IDN",
				params: {
					...creds,
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

			listeners.current.forEach((listener) => listener(command))
		}
	}, [getFreshAuthCredentials, identity, send, showToast, statusRef])

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

	const addListener = useCallback((listener: CommandListener) => {
		listeners.current.add(listener)
		return () => {
			listeners.current.delete(listener)
		}
	}, [])

	useEffect(() => connect(), [connect, identity, user.account, user.ticket])
	useEffect(() => () => disconnect(), [disconnect])

	const actions = useMemo(
		() => ({
			addListener,
			connect,
			disconnect,
			send,
		}),
		[addListener, connect, disconnect, send],
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
