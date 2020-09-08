import { useObservable } from "micro-observables"
import { useEffect, useMemo } from "react"
import { SocketHandler } from "../modules/chat/socket"

export default function Chat() {
	const socket = useMemo(() => new SocketHandler(), [])
	const socketStatus = useObservable(socket.status)

	useEffect(() => {
		socket.connect()
		return () => socket.disconnect()
	}, [socket])

	// TODO: switch on status
	return socketStatus
}
