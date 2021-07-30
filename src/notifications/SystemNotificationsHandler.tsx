import { decodeHtml } from "../dom/decodeHtml"
import { getAvatarUrl } from "../flist/helpers"
import { routes, useRoute } from "../router"
import { useSocketCommandMatch } from "../socket/SocketConnection"

export default function SystemNotificationsHandler() {
	const route = useRoute()

	useSocketCommandMatch({
		PRI({ character, message }) {
			const isPrivateChatRoute =
				route.name === "privateChat" && route.params.partnerName === character

			if (isPrivateChatRoute && document.hasFocus()) return

			const note = new window.Notification(`New message from ${character}`, {
				body: decodeHtml(message),
				icon: getAvatarUrl(character),
			})

			note.onclick = () => {
				routes.privateChat({ partnerName: character }).push()
				window.focus()
			}
		},
	})

	return null
}
