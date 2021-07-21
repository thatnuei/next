import clsx from "clsx"
import { useDeferredValue, useEffect } from "react"
import ChannelView from "../channel/ChannelView"
import DevTools from "../dev/DevTools"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { Route } from "../router"
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
	const deferredRoute = useDeferredValue(route)

	return (
		<>
			<ChatCommandHandlers />
			<ConnectionGuard>
				<div className="flex flex-row h-full gap-1">
					<div className="hidden md:block">
						<ChatNav />
					</div>
					<div
						className={clsx(
							"flex-1 min-w-0",
							route !== deferredRoute && "transition-opacity opacity-50",
						)}
						style={{ transitionDelay: route !== deferredRoute ? "0.3s" : "0" }}
					>
						<ChatRoutes route={deferredRoute} />
					</div>
				</div>
			</ConnectionGuard>
			{import.meta.env.DEV && <DevTools />}
		</>
	)
}

function ChatRoutes({ route }: { route: Route }) {
	return (
		<>
			{route.name === "channel" && <ChannelView {...route.params} />}
			{route.name === "privateChat" && <PrivateChatView {...route.params} />}
			{route.name === "notifications" && <NotificationListScreen />}
			{route.name === "chat" && <NoRoomView />}
		</>
	)
}
