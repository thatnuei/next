import type { ReactNode } from "react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import { useNotificationActions } from "../notifications/state"
import { useStateMachine } from "../state/useStateMachine"
import { socketUrl } from "./constants"
import type { ClientCommand, ServerCommand } from "./helpers"
import { createCommandString, parseServerCommand } from "./helpers"

type SocketMachineStatus =
	| "offline"
	| "connecting"
	| "identifying"
	| "online"
	| "error"
	| "closed"

type SocketMachineEvent =
	| { type: "connectStart"; identity: string }
	| { type: "identifyStart" }
	| { type: "identifySuccess" }
	| { type: "identifyError" }
	| { type: "networkError" }
	| { type: "socketClosed" }
	| { type: "manualDisconnect" }

type SocketMachineAction =
	| { type: "createSocket"; identity: string }
	| { type: "closeSocket" }

type CommandListener = (command: ServerCommand) => void

interface SocketActions {
	connect: (identity: string) => void
	disconnect: () => void
	send: (command: ClientCommand) => void
	addListener: (listener: CommandListener) => void
	callListeners: (command: ServerCommand) => void
}

export const ActionsContext = createContext<SocketActions>()
export const SocketStatusContext = createContext<SocketMachineStatus>("offline")

export function SocketConnection({ children }: { children: ReactNode }) {
	const socketRef = useRef<WebSocket>()
	const listeners = useRef(new Set<CommandListener>())

	const { getFreshAuthCredentials } = useAuthUserContext()
	const { addNotification } = useNotificationActions()

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

	const [status, statusDispatch] = useStateMachine<
		SocketMachineStatus,
		SocketMachineEvent,
		SocketMachineAction
	>({
		initialStatus: "offline",

		transitions: {
			offline: {
				connectStart: {
					state: "connecting",
					effects: (event) => [
						{ type: "createSocket", identity: event.identity },
					],
				},
			},
			connecting: {
				networkError: { state: "error" },
				identifyStart: { state: "identifying" },
				manualDisconnect: {
					state: "offline",
					effects: () => [{ type: "closeSocket" }],
				},
			},
			identifying: {
				identifyError: { state: "error" },
				identifySuccess: { state: "online" },
				manualDisconnect: {
					state: "offline",
					effects: () => [{ type: "closeSocket" }],
				},
			},
			online: {
				socketClosed: { state: "closed" },
				manualDisconnect: {
					state: "offline",
					effects: () => [{ type: "closeSocket" }],
				},
			},
			error: {
				connectStart: { state: "connecting" },
			},
			closed: {
				connectStart: { state: "connecting" },
			},
		},

		effects: {
			createSocket: ({ identity }) => {
				const socket = (socketRef.current = new WebSocket(socketUrl))

				socket.onopen = async () => {
					const result = await getFreshAuthCredentials().catch(toError)
					if (result instanceof Error) {
						statusDispatch({ type: "networkError" })

						// todo: move this to an action?
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
					statusDispatch({ type: "identifyStart" })
				}

				socket.onclose = () => {
					statusDispatch({ type: "socketClosed" })
				}

				socket.onerror = () => {
					statusDispatch({ type: "networkError" })
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
						statusDispatch({ type: "identifySuccess" })
					}

					if (command.type === "ERR") {
						// TODO: show toast
						console.warn("Socket error", command.params.message)
					}

					callListeners(command)
				}
			},

			closeSocket: () => {
				const socket = socketRef.current
				if (!socket) return
				socketRef.current = undefined
				socket.onopen = null
				socket.onclose = null
				socket.onerror = null
				socket.onmessage = null
				socket.close()
			},
		},
	})

	const connect = useCallback(
		(identity: string) => {
			statusDispatch({ type: "connectStart", identity })
		},
		[statusDispatch],
	)

	const disconnect = useCallback(() => {
		statusDispatch({ type: "manualDisconnect" })
	}, [statusDispatch])

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
		<SocketStatusContext.Provider value={status.state}>
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
