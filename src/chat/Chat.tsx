import { useObservable } from "micro-observables"
import { memo } from "react"
import ChannelView from "../channel/ChannelView"
import ChatNav from "../chatNav/ChatNav"
import { ChatNavProvider, useChatNav } from "../chatNav/chatNavContext"
import { useMediaQuery } from "../dom/useMediaQuery"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRootStore } from "../root/context"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"

export default function Chat() {
	const isSmallScreen = useMediaQuery(screenQueries.small)
	return (
		<div className={`fixed inset-0 flex`}>
			<ChatNavProvider>
				{!isSmallScreen && (
					<div className={`mr-1`}>
						<ChatNav />
					</div>
				)}
				<div className={`flex-1`}>
					<ChatRoomView />
				</div>
			</ChatNavProvider>
		</div>
	)
}

const ChatRoomView = memo(function ChatRoomView() {
	const root = useRootStore()
	const { view } = useChatNav()

	const isChannelJoined = useObservable(
		root.channelStore.isJoined(view?.channelId ?? ""),
	)

	const isPrivateChatOpen = useObservable(
		root.privateChatStore.isOpen(view?.privateChatPartner ?? ""),
	)

	if (view?.channelId && isChannelJoined) {
		return <ChannelView channelId={view.channelId} />
	}

	if (view?.privateChatPartner && isPrivateChatOpen) {
		return <PrivateChatView partnerName={view.privateChatPartner} />
	}

	return <NoRoomView />
})
