import { sum } from "lodash-es"
import { useEffect } from "react"
import { isTruthy } from "../common/isTruthy"
import type { Falsy } from "../common/types"
import { useUnreadNotificationCount } from "../notifications/state"
import { useOpenPrivateChats } from "../privateChat/state"
import type { RoomState } from "../room/state"
import { useIdentity } from "../user"

export default function AppTitle() {
	const identity = useIdentity()
	const privateChats = useOpenPrivateChats()
	const unreadNotificationCount = useUnreadNotificationCount()

	useEffect(() => {
		const countUnreadRooms = (rooms: readonly RoomState[]) =>
			sum(rooms.map((room) => (room.isUnread ? 1 : 0)))

		const totalUnread = unreadNotificationCount + countUnreadRooms(privateChats)

		const prefix = joinPresentStrings(
			[identity, totalUnread > 0 && `(${totalUnread})`],
			" ",
		)

		document.title = joinPresentStrings([prefix, "next"], " | ")
	}, [identity, privateChats, unreadNotificationCount])

	return null
}

function joinPresentStrings(
	strings: readonly (string | Falsy)[],
	separator: string,
) {
	return strings.filter(isTruthy).join(separator)
}
