import { useImmer } from "use-immer"
import { createCommandHandler } from "../chat/chatCommand"

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

export function useChannels(identity: string) {
	const [channels, updateChannels] = useImmer<Record<string, Channel>>({})

	const [joinedIdsDict, updateJoinedIdsDict] = useImmer<Record<string, true>>(
		{},
	)

	const joined = Object.keys(joinedIdsDict).map((key) => channels[key])

	const handleCommand = createCommandHandler({
		IDN() {},

		JCH({ channel: id, title, character: { identity: name } }) {
			updateChannels((channels) => {
				const channel = (channels[id] ||= createChannel(id, title))
				channel.title = title
				channel.users[name] = true
			})

			if (name === identity) {
				updateJoinedIdsDict((dict) => {
					dict[id] = true
				})
			}
		},

		LCH({ channel: id, character: name }) {
			updateChannels((channels) => {
				const channel = (channels[id] ||= createChannel(id))
				delete channel.users[name]
			})

			if (name === identity) {
				updateJoinedIdsDict((dict) => {
					delete dict[id]
				})
			}
		},

		FLN({ character }) {
			updateChannels((channels) => {
				for (const channel of Object.values(channels)) {
					delete channel.users[character]
				}
			})
		},
	})

	return { joined, handleCommand }
}
