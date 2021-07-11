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

type SocketMachineState =
	| { type: "offline" }
	| { type: "connecting"; identity: string }
	| { type: "identifying" }
	| { type: "online" }
	| { type: "willReconnect"; identity: string }
	| { type: "closed" }

type SocketMachineEvent =
	// connection initiated by the user, or by a reconnection event
	| { type: "connectStart"; identity: string }

	// failed to connect, can only happen during connection
	| { type: "connectError"; identity: string }

	// successfully connected, starting identification
	| { type: "identifyStart" }

	// successfully identified
	| { type: "identifySuccess" }

	// connection was closed by the server due to an error,
	// or the network went down
	| { type: "socketClosed"; identity: string }

	// connection was closed by the user
	| { type: "manualDisconnect" }

type SocketMachineAction =
	| { type: "createSocket"; identity: string }
	| { type: "connectDelayed"; identity: string }
	| { type: "closeSocket" }

type CommandListener = (command: ServerCommand) => void

interface SocketActions {
	connect: (identity: string) => void
	disconnect: () => void
	send: (command: ClientCommand) => void
	addListener: (listener: CommandListener) => void
	callListeners: (command: ServerCommand) => void
}

const ActionsContext = createContext<SocketActions>()

const SocketStatusContext = createContext<SocketMachineState>({
	type: "offline",
})

// https://toys.in.newtsin.space/api-docs/#server-closes-connection-after-issuing-an-err-protocol-command
const errorCodesToAvoidReconnection: ReadonlySet<number> = new Set([
	2, // server is full
	9, // banned
	30, // too many connections
	31, // logging in with same character from another location
	33, // invalid auth method
	39, // timed out
	40, /// kicked
])

export function SocketConnection({ children }: { children: ReactNode }) {
	const socketRef = useRef<WebSocket>()
	const listeners = useRef(new Set<CommandListener>())
	const shouldReconnect = useRef(false)

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

	const [state, dispatch] = useStateMachine<
		SocketMachineState,
		SocketMachineEvent,
		SocketMachineAction
	>({
		initialState: { type: "offline" },

		states: {
			offline: {
				on: {
					connectStart: {
						state: ({ identity }) => ({ type: "connecting", identity }),
					},
				},
			},
			connecting: {
				onEnter: ({ identity }) => [{ type: "createSocket", identity }],
				on: {
					connectError: {
						state: ({ identity }) => ({ type: "willReconnect", identity }),
					},
					identifyStart: {
						state: () => ({ type: "identifying" }),
					},
					manualDisconnect: {
						state: () => ({ type: "closed" }),
						effects: () => [{ type: "closeSocket" }],
					},
				},
			},
			identifying: {
				on: {
					identifySuccess: {
						state: () => ({ type: "online" }),
					},
					manualDisconnect: {
						state: () => ({ type: "closed" }),
						effects: () => [{ type: "closeSocket" }],
					},
					socketClosed: {
						state: () => ({ type: "closed" }),
					},
				},
			},
			online: {
				on: {
					socketClosed: {
						state: ({ identity }) =>
							shouldReconnect.current
								? { type: "willReconnect", identity }
								: { type: "closed" },
					},
					manualDisconnect: {
						state: () => ({ type: "closed" }),
						effects: () => [{ type: "closeSocket" }],
					},
				},
			},
			closed: {
				on: {
					connectStart: {
						state: ({ identity }) => ({ type: "connecting", identity }),
					},
				},
			},
			willReconnect: {
				onEnter: ({ identity }) => [{ type: "connectDelayed", identity }],
				on: {
					connectStart: {
						state: ({ identity }) => ({ type: "connecting", identity }),
					},
				},
			},
		},

		effects: {
			connectDelayed: ({ identity }) => {
				setTimeout(() => {
					dispatch({ type: "connectStart", identity })
				}, 5000)
			},

			createSocket: ({ identity }) => {
				shouldReconnect.current = true

				const socket = (socketRef.current = new WebSocket(socketUrl))

				socket.onopen = async () => {
					const result = await getFreshAuthCredentials().catch(toError)
					if (result instanceof Error) {
						dispatch({ type: "connectError", identity })

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
					dispatch({ type: "identifyStart" })
				}

				socket.onclose = () => {
					dispatch({ type: "socketClosed", identity })
				}

				socket.onerror = () => {
					dispatch({ type: "connectError", identity })
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
						dispatch({ type: "identifySuccess" })
					}

					if (
						command.type === "ERR" &&
						errorCodesToAvoidReconnection.has(command.params.number)
					) {
						shouldReconnect.current = false
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
			dispatch({ type: "connectStart", identity })
		},
		[dispatch],
	)

	const disconnect = useCallback(() => {
		dispatch({ type: "manualDisconnect" })
	}, [dispatch])

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
		<SocketStatusContext.Provider value={state.state}>
			<ActionsContext.Provider value={actions}>
				{children}
			</ActionsContext.Provider>
		</SocketStatusContext.Provider>
	)
}

export function useSocketStatus() {
	return useContext(SocketStatusContext).type
}

export function useSocketActions() {
	return useContext(ActionsContext) ?? raise("ActionsContext not found")
}

export function useSocketListener(listener: CommandListener) {
	const { addListener } = useSocketActions()
	return useEffect(() => addListener(listener))
}
