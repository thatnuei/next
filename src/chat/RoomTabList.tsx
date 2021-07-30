import { sortBy } from "lodash-es"
import type { Channel } from "../channel/state"
import { useChannelActions, useJoinedChannels } from "../channel/state"
import { useIsPublicChannel } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import { useNickname } from "../character/nicknames"
import {
	useOpenChatNames,
	usePrivateChat,
	usePrivateChatActions,
} from "../privateChat/state"
import { routes, useRoute } from "../router"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"

export default function RoomTabList() {
	const joinedChannels = useJoinedChannels()
	const privateChats = useOpenChatNames()

	return (
		<>
			{sortBy(privateChats, (name) => name.toLowerCase()).map((name) => (
				<PrivateChatTab key={name} partnerName={name} />
			))}
			{sortBy(joinedChannels, (ch) => ch.title.toLowerCase()).map((channel) => (
				<ChannelRoomTab key={channel.id} channel={channel} />
			))}
		</>
	)
}

function PrivateChatTab({ partnerName }: { partnerName: string }) {
	const route = useRoute()
	const privateChat = usePrivateChat(partnerName)
	const privateChatActions = usePrivateChatActions(partnerName)
	const nickname = useNickname(partnerName)

	return (
		<RoomTab
			title={nickname || partnerName}
			icon={<Avatar name={partnerName} size={6} />}
			isActive={
				route.name === "privateChat" && route.params.partnerName === partnerName
			}
			isUnread={privateChat.isUnread}
			onClick={() => routes.privateChat({ partnerName }).push()}
			onClose={() => privateChatActions.close()}
		/>
	)
}

function ChannelRoomTab({ channel }: { channel: Channel }) {
	const route = useRoute()
	const isPublic = useIsPublicChannel(channel.id)
	const { leave } = useChannelActions(channel.id)

	return (
		<RoomTab
			key={channel.id}
			title={channel.title}
			icon={
				isPublic ? <Icon which={icons.earth} /> : <Icon which={icons.lock} />
			}
			isActive={
				route.name === "channel" && route.params.channelId === channel.id
			}
			isUnread={channel.isUnread}
			onClick={() => routes.channel({ channelId: channel.id }).push()}
			onClose={() => leave()}
		/>
	)
}
