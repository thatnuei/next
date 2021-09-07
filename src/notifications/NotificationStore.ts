import type { CharacterStore } from "../character/CharacterStore"
import type { CharacterStatus } from "../character/types"
import { uniqueId } from "../common/uniqueId"
import type { ChatLogger } from "../logging/logger"
import { createSystemMessage } from "../message/MessageState"
import type { PrivateChatStore } from "../privateChat/PrivateChatStore"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createStore } from "../state/store"
import type { Notification, NotificationDetails, Toast } from "./types"

export type NotificationStore = ReturnType<typeof createNotificationStore>

export function createNotificationStore(
  logger: ChatLogger,
  characterStore: CharacterStore,
  privateChatStore: PrivateChatStore,
) {
  const notifications = createStore<Notification[]>([])
  const toasts = createStore<Toast[]>([])

  const store = {
    notifications: notifications.readonly(),
    toasts: toasts.readonly(),

    selectHasUnread() {
      return notifications.select((notes) =>
        notes.some((n) => n.readStatus === "unread"),
      )
    },

    addNotification(details: NotificationDetails) {
      notifications.update((notifications) => [
        {
          id: uniqueId(),
          timestamp: Date.now(),
          readStatus: "unread",
          details,
        },
        ...notifications,
      ])

      logger.setRoomName("notifications", "Notifications")
      logger.addMessage(
        "notifications",
        createSystemMessage(getNotificationMessage(details)),
      )
    },

    removeNotification(id: string) {
      notifications.update((notifications) =>
        notifications.filter((n) => n.id !== id),
      )
    },

    clearNotifications() {
      notifications.set([])
    },

    markAllReading() {
      notifications.update((notifications) =>
        notifications.map((n) =>
          n.readStatus === "unread" ? { ...n, readStatus: "reading" } : n,
        ),
      )
    },

    markAllRead() {
      notifications.update((notifications) =>
        notifications.map((n) => ({ ...n, readStatus: "read" })),
      )
    },

    addToast({
      details,
      duration,
      onClick,
    }: {
      details: NotificationDetails
      duration: number
      onClick?: () => void
    }) {
      toasts.update((toasts) => [
        ...toasts,
        { id: uniqueId(), details, duration, onClick },
      ])
    },

    removeToast(id: string) {
      toasts.update((toasts) => toasts.filter((t) => t.id !== id))
    },

    handleCommand(command: ServerCommand) {
      function addStatusNotification(
        name: string,
        status: CharacterStatus,
        message: string,
      ) {
        const isLiked = characterStore
          .selectLikedCharacters()
          .value.some((char) => char.name === name)

        const hasOpenChat = privateChatStore.openChatNames.value[name]

        const shouldAdd = isLiked && !hasOpenChat
        if (!shouldAdd) return

        store.addNotification({
          type: "status",
          name,
          status,
          message,
        })
      }

      matchCommand(command, {
        BRO({ message, character }) {
          const details: NotificationDetails = {
            type: "broadcast",
            message,
            actorName: character,
          }
          store.addNotification(details)
          store.addToast({
            details,
            duration: 10000,
          })
        },

        ERR({ message }) {
          store.addToast({
            details: { type: "error", message },
            duration: 10000,
          })
        },

        STA({ character: name, status, statusmsg }) {
          addStatusNotification(name, status, statusmsg)
        },

        NLN({ identity: name }) {
          addStatusNotification(name, "online", "")
        },

        FLN({ character: name }) {
          addStatusNotification(name, "offline", "")
        },

        CIU({ name: channelId, title, sender }) {
          const details: NotificationDetails = {
            type: "invite",
            channelId,
            title,
            sender,
          }
          store.addNotification(details)
          store.addToast({
            details,
            duration: 10000,
          })
        },

        SYS({ message }) {
          // we don't actually need to notify for these, so just log for now
          // eslint-disable-next-line no-console
          console.info(message)
        },
      })
    },
  }

  return store
}

function getNotificationMessage(details: NotificationDetails) {
  if (details.type === "broadcast") {
    const senderPrefix = details.actorName ? `${details.actorName}: ` : ""
    return `${senderPrefix}${details.message}`
  }

  if (details.type === "status") {
    const statusMessageSuffix = details.message ? `: ${details.message}` : ""
    return `${details.name} is now ${details.status}${statusMessageSuffix}`
  }

  if (details.type === "invite") {
    const bbcLink =
      details.channelId === details.title
        ? `[channel]${details.channelId}[/channel]`
        : `[session=${details.title}]${details.channelId}[/session]`

    return `${details.sender} has invited you to ${bbcLink}`
  }

  return details.message
}
