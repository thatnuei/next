import { sortBy } from "lodash-es"
import { useMatch, useNavigate } from "react-router-dom"
import type { Channel } from "../channel/state"
import { useChannelActions, useJoinedChannels } from "../channel/state"
import { useIsPublicChannel } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import {
	useOpenChatNames,
	usePrivateChatActions,
	usePrivateChatIsUnread,
} from "../privateChat/state"
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
	const match = useMatch("private-chat/:partnerName")
	const navigate = useNavigate()
	const isUnread = usePrivateChatIsUnread(partnerName)
	const { closePrivateChat } = usePrivateChatActions()

	return (
		<RoomTab
			title={partnerName}
			icon={<Avatar name={partnerName} className={`w-6 h-6`} />}
			isActive={match?.params.partnerName === partnerName}
			isUnread={isUnread}
			onClick={() => navigate(`private-chat/${partnerName}`)}
			onClose={() => closePrivateChat(partnerName)}
		/>
	)
}

function ChannelRoomTab({ channel }: { channel: Channel }) {
	const isPublic = useIsPublicChannel(channel.id)
	const match = useMatch("channel/:channelId")
	const navigate = useNavigate()
	const { leave } = useChannelActions()

	return (
		<RoomTab
			key={channel.id}
			title={channel.title}
			icon={
				isPublic ? <Icon which={icons.earth} /> : <Icon which={icons.lock} />
			}
			isActive={match?.params.channelId === channel.id}
			isUnread={channel.isUnread}
			onClick={() => navigate(`channel/${channel.id}`)}
			onClose={() => leave(channel.id)}
		/>
	)
}
