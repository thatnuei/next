import { computed, reactive } from "reactivue"
import { createCommandHandler } from "../chat/chatCommand"
import { isTruthy } from "../helpers/isTruthy"

export type Channel = {
	id: string
	title: string
	description: string
	messages: ChannelMessage[]
	users: Record<string, true>
}

export type ChannelMessage = {
	senderName: string
	text: string
	time: number
}

export function createChannel(id: string, title = id): Channel {
	return {
		id,
		title,
		description: "",
		messages: [],
		users: {},
	}
}

export function createChannelStore(identity: string) {
	const channels = reactive<Record<string, Channel>>({})
	const joinedIdsSet = reactive(new Set<string>())

	const joinedChannels = computed(() => {
		return [...joinedIdsSet].map((id) => channels[id]).filter(isTruthy)
	})

	const handleCommand = createCommandHandler({
		JCH({ channel: id, title, character: { identity: name } }) {
			console.log("JCH")
			const channel = (channels[id] ||= createChannel(id, title))
			channel.users[name] = true

			if (name === identity) {
				channel.title = title
				joinedIdsSet.add(id)
			}
		},

		LCH({ channel: id, character: name }) {
			console.log("LCH")
			const channel = (channels[id] ||= createChannel(id))
			delete channel.users[name]

			if (name === identity) {
				joinedIdsSet.delete(id)
			}
		},

		FLN({ character }) {
			console.log("FLN")
			for (const channel of Object.values(channels)) {
				delete channel.users[character]
			}
		},
	})

	return { joinedChannels, handleCommand }
}
