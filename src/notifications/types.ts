import type { CharacterStatus } from "../character/types"

export type Notification = {
  id: string
  timestamp: number
  readStatus: "unread" | "reading" | "read"
  details: NotificationDetails
}

export type Toast = {
  id: string
  details: NotificationDetails
  duration: number
  onClick?: () => void
}

export type NotificationDetails =
  | { type: "error" | "info"; message: string }
  | { type: "broadcast"; message: string; actorName?: string }
  | { type: "status"; name: string; status: CharacterStatus; message: string }
  | { type: "invite"; channelId: string; title: string; sender: string }
