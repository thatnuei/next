import { useEffect } from "react"
import { useChannelCommandHandler } from "../channel/state"
import { useChannelBrowserCommandHandler } from "../channelBrowser/state"
import { useCharacterCommandHandler } from "../character/state"
import { usePrivateChatCommandHandler } from "../privateChat/state"
import type { ServerCommand } from "../socket/helpers"
import { SocketConnection, useSocketActions } from "../socket/SocketConnection"
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
	const { addListener } = useSocketActions()
	const handleCharacterCommand = useCharacterCommandHandler()
	const handleChannelBrowserCommand = useChannelBrowserCommandHandler()
	const handleChannelCommand = useChannelCommandHandler()
	const showToast = useShowToast()
	usePrivateChatCommandHandler()

	useEffect(() =>
		addListener((command: ServerCommand) => {
			void handleCharacterCommand(command)
			handleChannelBrowserCommand(command)
			void handleChannelCommand(command)

			if (command.type === "ERR") {
				showToast({
					type: "error",
					content: command.params.message,
					duration: 5000,
				})
			}
		}),
	)

	return null
}
