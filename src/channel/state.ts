import { computed, createSetup, reactive } from "reactivue"
import { createCommandHandler } from "../chat/chatCommand"
import { isTruthy } from "../helpers/isTruthy"

type Channel = {
	id: string
	title: string
	description: string
	messages: ChannelMessage[]
	users: Record<string, true>
}

type ChannelMessage = {
	senderName: string
	text: string
	time: number
}

function createChannel(id: string, title = id): Channel {
	return {
		id,
		title,
		description: "",
		messages: [],
		users: {},
	}
}

type Props = { identity: string }

export const useChannelStore = createSetup((props: Props) => {
	const channels = reactive<Record<string, Channel>>({})
	const joinedIdsSet = reactive(new Set<string>())

	const joined = computed(() => {
		return [...joinedIdsSet].map((id) => channels[id]).filter(isTruthy)
	})

	const handleCommand = createCommandHandler({
		JCH({ channel: id, title, character: { identity: name } }) {
			const channel = (channels[id] ||= createChannel(id, title))
			channel.title = title
			channel.users[name] = true

			if (name === props.identity) {
				joinedIdsSet.add(id)
			}
		},

		LCH({ channel: id, character: name }) {
			const channel = (channels[id] ||= createChannel(id))
			delete channel.users[name]

			if (name === props.identity) {
				joinedIdsSet.delete(id)
			}
		},

		FLN({ character }) {
			for (const channel of Object.values(channels)) {
				delete channel.users[character]
			}
		},
	})

	return { joined, handleCommand }
})
