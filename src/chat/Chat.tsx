import { useEffect } from "react"
import { useChannelStore } from "../channel/state"
import { useSocket } from "./socket"

type Props = {
	account: string
	ticket: string
	identity: string
}

export default function Chat({ account, ticket, identity }: Props) {
	const socket = useSocket({})
	const channelStore = useChannelStore({ identity })

	useEffect(() => socket.listen(channelStore.handleCommand))

	useEffect(() => {
		return socket.listen((command) => {
			if (command.type === "IDN") {
				socket.send({ type: "JCH", params: { channel: "Frontpage" } })
				socket.send({ type: "JCH", params: { channel: "Fantasy" } })
				socket.send({ type: "JCH", params: { channel: "Development" } })
				socket.send({
					type: "JCH",
					params: { channel: "Story Driven LFRP" },
				})
			}
		})
	}, [socket])

	useEffect(() => {
		socket.connect({ account, ticket, character: identity })
		return () => socket.disconnect()
	}, [account, identity, socket, ticket])

	return (
		<main>
			<ul>
				{channelStore.joined.map((ch) => (
					<li key={ch.id}>{ch.title}</li>
				))}
			</ul>
		</main>
	)
}
