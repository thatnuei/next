import { atom } from "jotai"
import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { uniqueId } from "../common/uniqueId"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

interface NotificationBase {
	type: "error" | "info" | "broadcast"
	message: string
	actorName?: string | undefined
}

export interface Notification extends NotificationBase {
	id: string
}

interface NotificationOptions extends NotificationBase {
	save?: boolean
	showToast?: boolean
}

interface NotificationToast {
	id: string
	notification: Notification
	onClick?: () => void
}

const notificationListAtom = atomWithStorage<readonly Notification[]>(
	"notifications",
	[],
)

const toastListAtom = atom<readonly NotificationToast[]>([])

export function useNotificationList(): readonly Notification[] {
	return useAtomValue(notificationListAtom)
}

export function useNotificationToastList(): readonly NotificationToast[] {
	return useAtomValue(toastListAtom)
}

export function useNotificationActions() {
	const setNotifications = useUpdateAtom(notificationListAtom)
	const setToasts = useUpdateAtom(toastListAtom)

	return useMemo(() => {
		const addNotification = ({
			type,
			message,
			actorName,
			save = true,
			showToast = false,
		}: NotificationOptions): Notification => {
			const notification: Notification = {
				id: uniqueId(),
				type,
				message,
				actorName,
			}

			if (save) {
				setNotifications((notifications) => [notification, ...notifications])
			}

			if (showToast) {
				const toast: NotificationToast = { id: uniqueId(), notification }
				setToasts((toasts) => [...toasts, toast])
			}

			return notification
		}

		return {
			addNotification,

			removeNotification(id: string) {
				setNotifications((list) => list.filter((n) => n.id !== id))
			},

			removeToast(id: string) {
				setToasts((toasts) => toasts.filter((t) => t.id !== id))
			},
		}
	}, [setNotifications, setToasts])
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
					showToast: true,
				})
			},

			ERR({ message }) {
				actions.addNotification({
					type: "error",
					message,
					save: false,
					showToast: true,
				})
			},
		})
	})
}
