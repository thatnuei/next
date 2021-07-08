import { useChannelCommandListener } from "../channel/state"
import { useChannelBrowserCommandListener } from "../channelBrowser/state"
import { useCharacterCommandListener } from "../character/state"
import { useNotificationCommandListener } from "../notifications/state"
import { usePrivateChatCommandHandler } from "../privateChat/state"
import { useSocketListener } from "../socket/SocketConnection"
import { useShowToast } from "../toast/state"

export default function ChatCommandHandlers() {
	const showToast = useShowToast()

	useCharacterCommandListener()
	useChannelBrowserCommandListener()
	useChannelCommandListener()
	usePrivateChatCommandHandler()
	useNotificationCommandListener()

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
