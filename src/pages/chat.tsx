import { useObservable } from "micro-observables"
import Link from "next/link"
import { useEffect, useReducer } from "react"
import { handleCharacterCommand } from "../modules/character/character-state"
import { initialChatState } from "../modules/chat/chat-state"
import { SocketHandler } from "../modules/chat/socket"
import { useInstanceValue } from "../modules/react/useInstanceValue"

export default function Chat() {
	const [state, dispatch] = useReducer(handleCharacterCommand, initialChatState)

	const socket = useInstanceValue(() => new SocketHandler())
	const socketStatus = useObservable(socket.status)

	useEffect(() => {
		socket.onCommand = dispatch
		socket.connect()
		return () => socket.disconnect()
	}, [socket])

	switch (socketStatus) {
		case "connecting":
			return <p>Connecting...</p>

		case "identifying":
			return <p>Identifying...</p>

		case "no-session":
			return (
				<>
					<p>Login required</p>
					<Link href="/login">
						<a>Login</a>
					</Link>
				</>
			)

		case "closed":
			return (
				<>
					<p>Connection closed</p>
					<button type="button" onClick={() => socket.connect()}>
						Reconnect
					</button>
					<Link href="/login">
						<a>Login</a>
					</Link>
				</>
			)

		case "error":
			return (
				<>
					<p>Could not connect: network error</p>
					<button type="button" onClick={() => socket.connect()}>
						Reconnect
					</button>
					<Link href="/login">
						<a>Login</a>
					</Link>
				</>
			)

		case "online":
			return <p>chat!</p>

		default:
			return null
	}
}
