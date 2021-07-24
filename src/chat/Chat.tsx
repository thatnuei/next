import clsx from "clsx"
import { Provider as JotaiProvider } from "jotai"
import { useDeferredValue } from "react"
import AppTitle from "../app/AppTitle"
import ChannelView from "../channel/ChannelView"
import { CharacterStoreProvider } from "../character/store"
import DevTools from "../dev/DevTools"
import type { AuthUser } from "../flist/types"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import NotificationToastOverlay from "../notifications/NotificationToastOverlay"
import PrivateChatView from "../privateChat/PrivateChatView"
import { RouteProvider, useRoute } from "../router"
import { SocketConnection } from "../socket/SocketConnection"
import ChatCommandHandlers from "./ChatCommandHandlers"
import ChatNav from "./ChatNav"
import ConnectionGuard from "./ConnectionGuard"
import NoRoomView from "./NoRoomView"

export default function Chat({
	user,
	identity,
}: {
	user: AuthUser
	identity: string
}) {
	return (
		<RouteProvider>
			<JotaiProvider>
				<SocketConnection>
					<CharacterStoreProvider
						user={user}
						identity={identity}
						// temporary
						getFriendsAndBookmarks={() =>
							Promise.resolve({ bookmarklist: [], friendlist: [] })
						}
					>
						<AppTitle />
						<ChatCommandHandlers />
						<ConnectionGuard>
							<div className="flex flex-row h-full gap-1">
								<div className="hidden md:block">
									<ChatNav />
								</div>
								<ChatRoutes />
							</div>
						</ConnectionGuard>
						<NotificationToastOverlay />
						{import.meta.env.DEV && <DevTools />}
					</CharacterStoreProvider>
				</SocketConnection>
			</JotaiProvider>
		</RouteProvider>
	)
}

function ChatRoutes() {
	const route = useRoute()
	const deferredRoute = useDeferredValue(route)

	return (
		<div
			className={clsx(
				"flex-1 min-w-0",
				route !== deferredRoute && "transition-opacity opacity-50",
			)}
			style={{
				transitionDelay: route !== deferredRoute ? "0.3s" : "0",
			}}
		>
			{deferredRoute.name === "channel" && (
				<ChannelView {...deferredRoute.params} />
			)}
			{deferredRoute.name === "privateChat" && (
				<PrivateChatView {...deferredRoute.params} />
			)}
			{deferredRoute.name === "notifications" && <NotificationListScreen />}
			{deferredRoute.name === "logs" && <ChatLogBrowser />}
			{deferredRoute.name === false && <NoRoomView />}
		</div>
	)
}
