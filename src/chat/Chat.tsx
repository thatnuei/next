import { Routes } from "react-router-dom"
import ChannelView from "../channel/ChannelView"
import type { AuthUser } from "../flist/types"
import PrivateChatView from "../privateChat/PrivateChatView"
import TypedRoute from "../routing/TypedRoute"
import LoadingOverlay from "../ui/LoadingOverlay"
import NoRoomView from "./NoRoomView"

export default function Chat({
	user,
	identity,
}: {
	user: AuthUser
	identity: string
}) {
	return <LoadingOverlay text="Loading..." />

	return (
		<Routes>
			<TypedRoute
				path="channel/:channelId"
				render={(params) => <ChannelView {...params} />}
			/>

			<TypedRoute
				path="dm/:partnerName"
				render={(params) => <PrivateChatView {...params} />}
			/>

			<TypedRoute path="*" render={() => <NoRoomView />} />
		</Routes>
	)
}
