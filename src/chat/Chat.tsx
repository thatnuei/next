import { Routes } from "react-router-dom"
import ChannelView from "../channel/ChannelView"
import Button from "../dom/Button"
import type { AuthUser } from "../flist/types"
import PrivateChatView from "../privateChat/PrivateChatView"
import TypedRoute from "../routing/TypedRoute"
import { solidButton } from "../ui/components"
import LoadingOverlay from "../ui/LoadingOverlay"
import NoRoomView from "./NoRoomView"
import { useSocketConnection } from "./useSocketConnection"

export default function Chat({
	user,
	identity,
}: {
	user: AuthUser
	identity: string
}) {
	const { status, reconnect } = useSocketConnection(user, identity)

	switch (status) {
		case "connecting":
			return <LoadingOverlay text="Connecting..." />

		case "identifying":
			return <LoadingOverlay text="Identifying..." />

		case "closed":
			return (
				<ConnectionMessage
					message="The socket connection was closed by the server."
					onRetry={reconnect}
				/>
			)

		case "error":
			return (
				<ConnectionMessage
					message="An error occurred while connecting"
					onRetry={reconnect}
				/>
			)

		case "online":
			return <p>online!</p>
	}

	return null

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

function ConnectionMessage(props: { message: string; onRetry: () => void }) {
	return (
		<>
			<p>{props.message}</p>
			<Button className={solidButton} onClick={props.onRetry}>
				Retry
			</Button>
		</>
	)
}
