import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { uniqueId } from "../common/uniqueId"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

export interface Notification {
	id: string
	type: "broadcast"
	message: string
	actorName: string | undefined
	action?: () => void
}

const notificationListAtom = atom<readonly Notification[]>([])

export function useNotificationList(): readonly Notification[] {
	return useAtomValue(notificationListAtom)
}

export function useNotificationActions() {
	const setNotifications = useUpdateAtom(notificationListAtom)

	return useMemo(() => {
		function addNotification(notification: Omit<Notification, "id">) {
			setNotifications((list) => [{ ...notification, id: uniqueId() }, ...list])
		}

		function removeNotification(id: string) {
			setNotifications((list) => list.filter((n) => n.id !== id))
		}

		return {
			addNotification,
			removeNotification,
		}
	}, [setNotifications])
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
