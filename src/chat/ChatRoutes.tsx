import { Routes } from "react-router-dom"
import TypedRoute from "../routing/TypedRoute"
import NoRoomView from "./NoRoomView"

export default function ChatRoutes() {
	return (
		<Routes>
			<TypedRoute path="*" render={() => <NoRoomView />} />

			<TypedRoute
				path="channel/:channelId"
				render={(params) => <p>channel {params.channelId}</p>}
			/>

			<TypedRoute
				path="dm/:partnerName"
				render={(params) => <p>private chat {params.partnerName}</p>}
			/>
		</Routes>
	)
}
