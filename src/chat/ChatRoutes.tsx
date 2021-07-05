import { Routes } from "react-router-dom"
import ChannelView from "../channel/ChannelView"
import PrivateChatView from "../privateChat/PrivateChatView"
import TypedRoute from "../routing/TypedRoute"
import NoRoomView from "./NoRoomView"

export default function ChatRoutes() {
	return (
		<Routes>
			<TypedRoute path="*" render={() => <NoRoomView />} />

			<TypedRoute
				path="channel/:channelId"
				render={(params) => <ChannelView {...params} />}
			/>

			<TypedRoute
				path="private-chat/:partnerName"
				render={(params) => <PrivateChatView {...params} />}
			/>
		</Routes>
	)
}
