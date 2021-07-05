import { useEffect } from "react"
import { useChannelCommandHandler } from "../channel/state"
import { useChannelBrowserCommandHandler } from "../channelBrowser/state"
import { useCharacterCommandHandler } from "../character/state"
import { ChatNavProvider } from "../chatNav/chatNavContext"
import type { ServerCommand } from "../socket/helpers"
import { SocketConnection, useSocketActions } from "../socket/SocketConnection"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"

export default function Chat() {
	return (
		<SocketConnection>
			<CommandHandlers />
			<ConnectionGuard>
				<ChatNavProvider>
					<div className="flex flex-row h-full gap-1">
						<div className="hidden md:block">
							<ChatNav />
						</div>
						<div className="flex-1">
							<ChatRoutes />
						</div>
					</div>
				</ChatNavProvider>
			</ConnectionGuard>
		</SocketConnection>
	)
}

function CommandHandlers() {
	const { addListener } = useSocketActions()
	const handleCharacterCommand = useCharacterCommandHandler()
	const handleChannelBrowserCommand = useChannelBrowserCommandHandler()
	const handleChannelCommand = useChannelCommandHandler()

	useEffect(() =>
		addListener((command: ServerCommand) => {
			void handleCharacterCommand(command)
			handleChannelBrowserCommand(command)
			void handleChannelCommand(command)
		}),
	)

	return null
}
