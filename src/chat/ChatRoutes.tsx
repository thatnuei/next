import ChannelView from "../channel/ChannelView"
import NotificationList from "../notifications/NotificationList"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRoute } from "../router"
import { ScreenHeader } from "../ui/ScreenHeader"
import NoRoomView from "./NoRoomView"

export default function ChatRoutes() {
	const route = useRoute()
	return (
		<>
			{route.name === "home" && <NoRoomView />}
			{route.name === "channel" && <ChannelView {...route.params} />}
			{route.name === "privateChat" && <PrivateChatView {...route.params} />}
			{route.name === "notifications" && (
				<div className="flex flex-col h-full gap-1">
					<div className="bg-midnight-0">
						<ScreenHeader>Notifications</ScreenHeader>
					</div>
					<div className="flex-1 min-h-0 overflow-y-auto">
						<NotificationList />
					</div>
				</div>
			)}
		</>
	)
}
