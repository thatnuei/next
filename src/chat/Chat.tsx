import DevTools from "../dev/DevTools"
import { SocketConnection } from "../socket/SocketConnection"
import ChatCommandHandlers from "./ChatCommandHandlers"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"

export default function Chat() {
	return (
		<SocketConnection>
			<ChatCommandHandlers />
			<ConnectionGuard>
				<div className="flex flex-row h-full gap-1">
					<div className="hidden md:block">
						<ChatNav />
					</div>
					<div className="flex-1">
						<ChatRoutes />
					</div>
				</div>
			</ConnectionGuard>
			{process.env.NODE_ENV === "development" && <DevTools />}
		</SocketConnection>
	)
}
