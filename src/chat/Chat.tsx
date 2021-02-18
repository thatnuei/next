import { motion } from "framer-motion"
import { useObservable } from "micro-observables"
import { useMemo } from "react"
import { tw } from "twind"
import ChannelView from "../channel/ChannelView"
import ChatNav from "../chatNav/ChatNav"
import { useChatNavView } from "../chatNav/helpers"
import { useMediaQuery } from "../dom/useMediaQuery"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRootStore } from "../root/context"
import { fadeAnimation } from "../ui/animation"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"

export default function Chat() {
	const isSmallScreen = useMediaQuery(screenQueries.small)
	const chatRoomView = useMemo(() => <ChatRoomView />, [])

	return (
		<motion.div className={tw`fixed inset-0 flex`} {...fadeAnimation}>
			{!isSmallScreen && (
				<div className={tw`mr-1`}>
					<ChatNav />
				</div>
			)}

			<div className={tw`flex-1`}>{chatRoomView}</div>
		</motion.div>
	)
}

function ChatRoomView() {
	const root = useRootStore()
	const view = useChatNavView()

	const isChannelJoined = useObservable(
		root.channelStore.isJoined(view.channelId ?? ""),
	)

	const isPrivateChatOpen = useObservable(
		root.privateChatStore.isOpen(view.privateChatPartner ?? ""),
	)

	if (view.channelId && isChannelJoined) {
		return <ChannelView channelId={view.channelId} />
	}

	if (view.privateChatPartner && isPrivateChatOpen) {
		return <PrivateChatView partnerName={view.privateChatPartner} />
	}

	return <NoRoomView />
}
