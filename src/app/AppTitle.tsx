import { useEffect } from "react"
import { isTruthy } from "../common/isTruthy"
import type { Falsy } from "../common/types"
import { useNotificationList } from "../notifications/state"
import { useOpenPrivateChats } from "../privateChat/state"
import { useIdentity } from "../user"

export default function AppTitle() {
	const identity = useIdentity()

	const privateChats = useOpenPrivateChats()
	const unreadChats = privateChats.filter((chat) => chat.isUnread)

	const notifications = useNotificationList()
	const unreadNotifications = notifications
		.filter((n) => n.readStatus === "unread")
		.filter((n) => n.type === "invite" || n.type === "broadcast")

	const totalUnread = unreadChats.length + unreadNotifications.length

	const prefixParts = [identity, totalUnread > 0 && `(${totalUnread})`]
	const prefix = joinContentfulStrings(prefixParts, " ")
	const title = joinContentfulStrings([prefix, "next"], " | ")

	useEffect(() => {
		document.title = title
	})

	return null
}

function joinContentfulStrings(
	strings: readonly (string | Falsy)[],
	separator: string,
) {
	return strings.filter(isTruthy).join(separator)
}
