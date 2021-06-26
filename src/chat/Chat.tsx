import { Routes } from "react-router-dom"
import ChatNav from "../chatNav/ChatNav"
import { ChatNavAction } from "../chatNav/ChatNavAction"
import Button from "../dom/Button"
import type { AuthUser } from "../flist/types"
import TypedRoute from "../routing/TypedRoute"
import { solidButton } from "../ui/components"
import * as icons from "../ui/icons"
import LoadingOverlay from "../ui/LoadingOverlay"
import NoRoomView from "./NoRoomView"
import { useSocketConnection } from "./useSocketConnection"

export default function Chat({
	user,
	identity,
	onLogout,
}: {
	user: AuthUser
	identity: string
	onLogout: () => void
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
	}

	if (status !== "online") {
		return null
	}

	return (
		<div className="flex flex-row h-full gap-1">
			<ChatNav identity={identity}>
				<ChatNavAction icon={icons.list} name="Browse channels" />
				<ChatNavAction icon={icons.updateStatus} name="Update your status" />
				<ChatNavAction
					icon={icons.users}
					name="See online friends and bookmarks"
				/>
				<ChatNavAction icon={icons.about} name="About next" />
				<div className={`flex-1`} />
				<ChatNavAction icon={icons.logout} name="Log out" onClick={onLogout} />
			</ChatNav>

			<div className="flex-1">
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
			</div>
		</div>
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
