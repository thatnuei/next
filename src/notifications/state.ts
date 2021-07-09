import { atom } from "jotai"
import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { useLikedCharacters } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { uniqueId } from "../common/uniqueId"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

type NotificationBase =
	| { type: "error" | "info"; message: string }
	| { type: "broadcast"; message: string; actorName?: string }
	| { type: "status"; name: string; status: CharacterStatus; message: string }

export type Notification = NotificationBase & {
	id: string
	timestamp: number
}

type NotificationOptions = NotificationBase & {
	save?: boolean
	showToast?: boolean
}

interface NotificationToast {
	id: string
	notification: Notification
	onClick?: () => void
}

const notificationListAtom = atomWithStorage<readonly Notification[]>(
	"notifications-v2",
	[],
)

const toastListAtom = atom<readonly NotificationToast[]>([])

// juuust in case
const maxNotifications = 1000

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
			save = true,
			showToast = false,
			...notificationProperties
		}: NotificationOptions): Notification => {
			const notification: Notification = {
				id: uniqueId(),
				timestamp: Date.now(),
				...notificationProperties,
			}

			if (save) {
				setNotifications((notifications) =>
					[notification, ...notifications].slice(0, maxNotifications),
				)
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
	const likedCharacters = useLikedCharacters()

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

			STA({ character, status, statusmsg }) {
				if (likedCharacters.some((char) => char.name === character)) {
					actions.addNotification({
						type: "status",
						name: character,
						status,
						message: statusmsg,
					})
				}
			},

			FLN({ character }) {
				if (likedCharacters.some((char) => char.name === character)) {
					actions.addNotification({
						type: "status",
						name: character,
						status: "offline",
						message: "",
					})
				}
			},
		})
	})
}
