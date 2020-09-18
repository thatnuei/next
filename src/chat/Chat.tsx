import { useChannels } from "../channel/state"
import { useSocket } from "./socket"

type Props = {
	account: string
	ticket: string
	identity: string
}

export default function Chat({ account, ticket, identity }: Props) {
	const channels = useChannels(identity)

	const socket = useSocket(account, ticket, identity, (command) => {
		socket.send({ type: "JCH", params: { channel: "Frontpage" } })
		socket.send({ type: "JCH", params: { channel: "Fantasy" } })
		socket.send({ type: "JCH", params: { channel: "Development" } })
		socket.send({
			type: "JCH",
			params: { channel: "Story Driven LFRP" },
		})

		channels.handleCommand(command)
	})

	return <>{socket.status}</>
}
