import { atom } from "jotai"
import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { useLikedCharacters } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { uniqueId } from "../common/uniqueId"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"
import { useUserCharacters } from "../user"

/// constants
const maxNotifications = 1000

/// types
type NotificationBase =
	| { type: "error" | "info"; message: string }
	| { type: "broadcast"; message: string; actorName?: string }
	| { type: "status"; name: string; status: CharacterStatus; message: string }
	| { type: "invite"; channelId: string; title: string; sender: string }

export type Notification = NotificationBase & {
	readonly id: string
	readonly timestamp: number
}

type NotificationOptions = NotificationBase & {
	readonly save?: boolean
	readonly showToast?: boolean
	readonly toastDuration?: number
	readonly incrementUnread?: boolean
}

interface NotificationToast {
	readonly id: string
	readonly notification: Notification
	readonly duration: number
	readonly onClick?: () => void
}

/// atoms
const notificationListAtom = atomWithStorage<readonly Notification[]>(
	"notifications-v2",
	[],
)

const toastListAtom = atom<readonly NotificationToast[]>([])

const unreadNotificationCountAtom = atomWithStorage(
	"unread-notification-count",
	0,
)

/// hooks
export function useNotificationList(): readonly Notification[] {
	return useAtomValue(notificationListAtom)
}

export function useNotificationToastList(): readonly NotificationToast[] {
	return useAtomValue(toastListAtom)
}

export function useUnreadNotificationCount(): number {
	return useAtomValue(unreadNotificationCountAtom)
}

export function useNotificationActions() {
	const setNotifications = useUpdateAtom(notificationListAtom)
	const setToasts = useUpdateAtom(toastListAtom)
	const setUnreadNotificationCount = useUpdateAtom(unreadNotificationCountAtom)

	return useMemo(() => {
		const addNotification = ({
			save = true,
			showToast = false,
			toastDuration = 10000,
			incrementUnread = true,
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
				if (incrementUnread) {
					setUnreadNotificationCount((count) => count + 1)
				}
			}

			if (showToast) {
				const toast: NotificationToast = {
					id: uniqueId(),
					notification,
					duration: toastDuration,
				}
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

			clearNotifications() {
				setNotifications([])
			},

			markAsRead() {
				setUnreadNotificationCount(0)
			},
		}
	}, [setNotifications, setToasts, setUnreadNotificationCount])
}

export function useNotificationCommandListener() {
	const actions = useNotificationActions()
	const likedCharacters = useLikedCharacters()
	const userCharacters = useUserCharacters()

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

			STA({ character: name, status, statusmsg }) {
				if (likedCharacters.some((char) => char.name === name)) {
					actions.addNotification({
						type: "status",
						name,
						status,
						message: statusmsg,
						incrementUnread: !userCharacters.includes(name),
					})
				}
			},

			NLN({ identity: name }) {
				if (likedCharacters.some((char) => char.name === name)) {
					actions.addNotification({
						type: "status",
						name,
						status: "online",
						message: "",
						incrementUnread: !userCharacters.includes(name),
					})
				}
			},

			FLN({ character: name }) {
				if (likedCharacters.some((char) => char.name === name)) {
					actions.addNotification({
						type: "status",
						name,
						status: "offline",
						message: "",
						incrementUnread: !userCharacters.includes(name),
					})
				}
			},

			CIU({ name: channelId, title, sender }) {
				actions.addNotification({
					type: "invite",
					channelId,
					title,
					sender,
					showToast: true,
				})
			},
		})
	})
}
