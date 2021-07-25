import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { useLikedCharacters } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { uniqueId } from "../common/uniqueId"
import { useChatLogger } from "../logging/context"
import { createSystemMessage } from "../message/MessageState"
import { routes, useRoute } from "../router"
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
	| { type: "privateMessage"; message: string; senderName: string }

export type Notification = NotificationBase & {
	readonly id: string
	readonly timestamp: number
}

type NotificationOptions = NotificationBase & {
	readonly save?: boolean
	readonly showToast?: boolean
	readonly toastDuration?: number
	readonly incrementUnread?: boolean
	readonly showSystemNotification?: boolean
}

interface NotificationToast {
	readonly id: string
	readonly notification: Notification
	readonly duration: number
	readonly onClick?: () => void
}

/// atoms
const notificationListAtom = atom<readonly Notification[]>([])
const toastListAtom = atom<readonly NotificationToast[]>([])
const unreadNotificationCountAtom = atom(0)

// helper functions
function getNotificationMessage(notification: Notification) {
	if (notification.type === "broadcast") {
		const senderPrefix = notification.actorName
			? `${notification.actorName}: `
			: ""

		return `${senderPrefix}${notification.message}`
	}

	if (notification.type === "status") {
		const statusMessageSuffix = notification.message
			? `: ${notification.message}`
			: ""

		return `${notification.name} is now ${notification.status}${statusMessageSuffix}`
	}

	if (notification.type === "invite") {
		const bbcLink =
			notification.channelId === notification.title
				? `[channel]${notification.channelId}[/channel]`
				: `[session=${notification.title}]${notification.channelId}[/session]`

		return `${notification.sender} has invited you to ${bbcLink}`
	}

	return notification.message
}

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
	const logger = useChatLogger()

	return useMemo(() => {
		const addNotification = ({
			save = true,
			showToast = false,
			toastDuration = 10000,
			incrementUnread = true,
			showSystemNotification = false,
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
				logger.setRoomName("notifications", "Notifications")
				logger.addMessage(
					"notifications",
					createSystemMessage(getNotificationMessage(notification)),
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

			if (showSystemNotification) {
				if (window.Notification.permission === "granted") {
					// TODO: strip BBCode from this
					const note = new window.Notification(
						getNotificationMessage(notification),
					)
					note.onclick = () => {
						if (notification.type === "privateMessage") {
							window.focus()
							routes
								.privateChat({ partnerName: notification.senderName })
								.push()
						}
					}
				}
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
	}, [logger, setNotifications, setToasts, setUnreadNotificationCount])
}

export function useNotificationCommandListener() {
	const actions = useNotificationActions()
	const likedCharacters = useLikedCharacters()
	const userCharacters = useUserCharacters()
	const route = useRoute()

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

			PRI({ character, message }) {
				const isPrivateChatRoute =
					route.name === "privateChat" && route.params.partnerName === character

				if (!isPrivateChatRoute) return
				if (document.hasFocus()) return

				actions.addNotification({
					type: "info",
					message: `Message from ${character}: ${message}`,
					save: false,
					incrementUnread: false,
					showSystemNotification: true,
				})
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

			SYS({ message }) {
				// we don't actually need to notify for these, so just log for now
				console.info(message)
			},
		})
	})
}
