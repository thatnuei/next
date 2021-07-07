import { useChannelCommandListener } from "../channel/state"
import { useChannelBrowserCommandListener } from "../channelBrowser/state"
import { useCharacterCommandListener } from "../character/state"
import { usePrivateChatCommandHandler } from "../privateChat/state"
import { SocketConnection, useSocketListener } from "../socket/SocketConnection"
import { useShowToast } from "../toast/state"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"

export default function Chat() {
	return (
		<SocketConnection>
			<CommandHandlers />
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
		</SocketConnection>
	)
}

function CommandHandlers() {
	const showToast = useShowToast()

	useCharacterCommandListener()
	useChannelBrowserCommandListener()
	useChannelCommandListener()
	usePrivateChatCommandHandler()

	useSocketListener((command) => {
		if (command.type === "ERR") {
			showToast({
				type: "error",
				content: command.params.message,
				duration: 5000,
			})
		}
	})

	return null
}
