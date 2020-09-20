import { useObservable } from "micro-observables"
import { useEffect } from "react"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelStore } from "../channel/ChannelStore"
import { useInstanceValue } from "../react/useInstanceValue"
import { SocketHandler } from "./SocketHandler"

type Props = {
	account: string
	ticket: string
	identity: string
}

export default function Chat(props: Props) {
	const socket = useInstanceValue(() => new SocketHandler())
	const channelStore = useInstanceValue(() => new ChannelStore(props.identity))

	const status = useObservable(socket.status)
	const joinedChannels = useObservable(channelStore.joinedChannels)

	useEffect(() => socket.listen(channelStore.handleCommand), [
		channelStore.handleCommand,
		socket,
	])

	useEffect(() => {
		return socket.listen((command) => {
			if (command.type === "IDN") {
				socket.send({ type: "JCH", params: { channel: "Frontpage" } })
				socket.send({ type: "JCH", params: { channel: "Fantasy" } })
				socket.send({ type: "JCH", params: { channel: "Story Driven LFRP" } })
				socket.send({ type: "JCH", params: { channel: "Development" } })
			}
		})
	}, [socket])

	const { account, ticket, identity } = props
	useEffect(() => {
		socket.connect({ account, ticket, character: identity })
		return () => socket.disconnect()
	}, [account, identity, socket, ticket])

	return (
		<main>
			<p>{status}</p>
			<ul>
				{joinedChannels.map((ch) => (
					<li key={ch.id}>
						<ChannelTab channel={ch} />
					</li>
				))}
			</ul>
		</main>
	)
}

function ChannelTab({ channel }: { channel: ChannelModel }) {
	const title = useObservable(channel.title)
	return <>{title}</>
}
