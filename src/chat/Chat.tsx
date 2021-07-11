import { useEffect } from "react"
import ChannelView from "../channel/ChannelView"
import DevTools from "../dev/DevTools"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRoute } from "../router"
import { useSocketActions } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import ChatCommandHandlers from "./ChatCommandHandlers"
import ChatNav from "./ChatNav"
import ConnectionGuard from "./ConnectionGuard"
import NoRoomView from "./NoRoomView"

export default function Chat() {
	const { connect, disconnect } = useSocketActions()
	const identity = useIdentity()

	useEffect(() => {
		if (identity) {
			connect(identity)
			return () => {
				disconnect()
			}
		}
	}, [connect, disconnect, identity])

	const route = useRoute()

	return (
		<>
			<ChatCommandHandlers />
			<ConnectionGuard>
				<div className="flex flex-row h-full gap-1">
					<div className="hidden md:block">
						<ChatNav />
					</div>
					<div className="flex-1">
						{route.name === "channel" && <ChannelView {...route.params} />}
						{route.name === "privateChat" && (
							<PrivateChatView {...route.params} />
						)}
						{route.name === "notifications" && <NotificationListScreen />}
						{route.name === "chat" && <NoRoomView />}
					</div>
				</div>
			</ConnectionGuard>
			{import.meta.env.DEV && <DevTools />}
		</>
	)
}
