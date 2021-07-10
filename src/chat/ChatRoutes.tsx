import ChannelView from "../channel/ChannelView"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRoute } from "../router"
import NoRoomView from "./NoRoomView"

export default function ChatRoutes() {
	const route = useRoute()
	return (
		<>
			{route.name === "home" && <NoRoomView />}
			{route.name === "channel" && <ChannelView {...route.params} />}
			{route.name === "privateChat" && <PrivateChatView {...route.params} />}
			{route.name === "notifications" && <NotificationListScreen />}
		</>
	)
}
