import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { action } from "mobx"
import { useMemo } from "react"
import { useLikedCharacters } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { uniqueId } from "../common/uniqueId"
import { useChatLogger } from "../logging/context"
import { createSystemMessage } from "../message/MessageState"
import { matchCommand } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

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
  readonly readStatus: "unread" | "reading" | "read"
}

type NotificationOptions = NotificationBase & {
  readonly save?: boolean
  readonly showToast?: boolean
  readonly toastDuration?: number
}

type NotificationToast = {
  readonly id: string
  readonly notification: Notification
  readonly duration: number
  readonly onClick?: () => void
}

/// atoms
const notificationListAtom = atom<readonly Notification[]>([])
const toastListAtom = atom<readonly NotificationToast[]>([])

const hasUnreadNotificationsAtom = atom((get) => {
  const notifications = get(notificationListAtom)
  return notifications.some(({ readStatus }) => readStatus === "unread")
})

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

export function useHasUnreadNotifications(): boolean {
  return useAtomValue(hasUnreadNotificationsAtom)
}

export function useNotificationActions() {
  const setNotifications = useUpdateAtom(notificationListAtom)
  const setToasts = useUpdateAtom(toastListAtom)
  const logger = useChatLogger()

  return useMemo(() => {
    const addNotification = ({
      save = true,
      showToast = false,
      toastDuration = 10000,
      ...notificationProperties
    }: NotificationOptions): Notification => {
      const notification: Notification = {
        id: uniqueId(),
        timestamp: Date.now(),
        readStatus: "unread",
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

      markNotificationsReading() {
        setNotifications((notifications) =>
          notifications.map((n) =>
            n.readStatus === "unread" ? { ...n, readStatus: "reading" } : n,
          ),
        )
      },

      markNotificationsRead() {
        setNotifications((notifications) =>
          notifications.map((n) => ({ ...n, readStatus: "read" })),
        )
      },
    }
  }, [logger, setNotifications, setToasts])
}

export function useNotificationCommandListener() {
  const actions = useNotificationActions()
  const likedCharacters = useLikedCharacters()

  useSocketListener(
    action(function handleNotificationCommand(command) {
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

        SYS({ message }) {
          // we don't actually need to notify for these, so just log for now
          console.info(message)
        },
      })
    }),
  )
}
