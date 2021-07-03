import { sortBy } from "lodash-es"
import { useObservable } from "micro-observables"
import { useMatch, useNavigate } from "react-router-dom"
import type { Channel } from "../channel/state"
import { useChannelActions, useJoinedChannels } from "../channel/state"
import { useIsPublicChannel } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import { useOpenPrivateChats } from "../privateChat/helpers"
import type { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatNav } from "./chatNavContext"
import RoomTab from "./RoomTab"

function RoomTabList() {
	const joinedChannels = useJoinedChannels()
	const privateChats = useOpenPrivateChats()

	const privateChatTabs = sortBy(privateChats, (chat) =>
		chat.partnerName.toLowerCase(),
	).map((chat) => <PrivateChatTab key={chat.partnerName} chat={chat} />)

	const channelTabs = joinedChannels.map((channel) => (
		<ChannelRoomTab key={channel.id} channel={channel} />
	))

	return <>{[privateChatTabs, channelTabs]}</>
}

export default RoomTabList

function PrivateChatTab({ chat }: { chat: PrivateChatModel }) {
	const root = useRootStore()
	const isUnread = useObservable(chat.isUnread)

	const { view, showPrivateChat } = useChatNav()
	const isActive = view?.privateChatPartner === chat.partnerName

	return (
		<RoomTab
			title={chat.partnerName}
			icon={<Avatar name={chat.partnerName} className={`w-5 h-5`} />}
			isActive={isActive}
			isUnread={isUnread}
			onClick={() => showPrivateChat(chat.partnerName)}
			onClose={() => root.privateChatStore.close(chat.partnerName)}
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
