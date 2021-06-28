import { useChannelBrowserCommandHandler } from "../channelBrowser/state"
import { useCharacterCommandHandler } from "../character/state"
import type { AuthUser } from "../flist/types"
import type { ServerCommand } from "../socket/helpers"
import { SocketConnection } from "../socket/SocketConnection"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"

export default function Chat({ user }: { user: AuthUser }) {
	const handleCharacterCommand = useCharacterCommandHandler()
	const handleChannelBrowserCommand = useChannelBrowserCommandHandler()

	const handleCommand = (command: ServerCommand) => {
		handleCharacterCommand(command, user)
		handleChannelBrowserCommand(command)
	}

	return (
		<SocketConnection user={user} onCommand={handleCommand}>
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
