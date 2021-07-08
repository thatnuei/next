import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { uniqueId } from "../common/uniqueId"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

export interface Notification {
	id: string
	type: "broadcast"
	message: string
	actorName: string | undefined
}

const notificationListAtom = atomWithStorage<readonly Notification[]>(
	"notifications",
	[],
)

export function useNotificationList(): readonly Notification[] {
	return useAtomValue(notificationListAtom)
}

export function useNotificationActions() {
	const setNotifications = useUpdateAtom(notificationListAtom)

	return useMemo(
		() => ({
			addNotification(notification: Omit<Notification, "id">) {
				setNotifications((list) => [
					{ ...notification, id: uniqueId() },
					...list,
				])
			},
			removeNotification(id: string) {
				setNotifications((list) => list.filter((n) => n.id !== id))
			},
		}),
		[setNotifications],
	)
}

export function useNotificationCommandListener() {
	const actions = useNotificationActions()

	useSocketListener((command) => {
		matchCommand(command, {
			BRO({ message, character }) {
				actions.addNotification({
					type: "broadcast",
					message,
					actorName: character,
				})
			},
		})
	})
}
