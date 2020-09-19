import { useEffect } from "react"
import { computed, onMounted, onUnmounted, reactive, useSetup } from "reactivue"
import { Channel, createChannel } from "../channel/state"
import { isTruthy } from "../helpers/isTruthy"
import { createCommandHandler } from "./chatCommand"
import { createSocketHandler } from "./socket"

type Props = {
	account: string
	ticket: string
	identity: string
}

export default function Chat(props: Props) {
	const { socket, joinedChannels } = useSetup((props) => {
		const socket = createSocketHandler()

		const channels = reactive<Record<string, Channel>>({})
		const joinedIdsSet = reactive(new Set<string>())

		const joinedChannels = computed(() => {
			return [...joinedIdsSet].map((id) => channels[id]).filter(isTruthy)
		})

		socket.listen(
			createCommandHandler({
				IDN() {
					socket.send({ type: "JCH", params: { channel: "Frontpage" } })
					socket.send({ type: "JCH", params: { channel: "Fantasy" } })
					socket.send({ type: "JCH", params: { channel: "Development" } })
					socket.send({
						type: "JCH",
						params: { channel: "Story Driven LFRP" },
					})
				},

				JCH({ channel: id, title, character: { identity: name } }) {
					console.log("JCH")
					const channel = (channels[id] ||= createChannel(id, title))
					channel.users[name] = true

					if (name === props.identity) {
						channel.title = title
						joinedIdsSet.add(id)
					}
				},

				LCH({ channel: id, character: name }) {
					console.log("LCH")
					const channel = (channels[id] ||= createChannel(id))
					delete channel.users[name]

					if (name === props.identity) {
						joinedIdsSet.delete(id)
					}
				},

				FLN({ character }) {
					console.log("FLN")
					for (const channel of Object.values(channels)) {
						delete channel.users[character]
					}
				},
			}),
		)

		onMounted(() => {
			const { account, ticket, identity } = props
			socket.connect({ account, ticket, character: identity })
		})

		onUnmounted(() => {
			socket.disconnect()
			socket.removeListeners()
		})

		return { socket, joinedChannels }
	}, props)

	useEffect(() => {
		console.log("render")
	})

	return (
		<main>
			<p>{socket.status}</p>
			<ul>
				{joinedChannels.map((ch) => (
					<li key={ch.id}>{ch.title}</li>
				))}
			</ul>
		</main>
	)
}
