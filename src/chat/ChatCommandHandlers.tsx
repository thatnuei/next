import { useChannelCommandHandler } from "../channel/state"
import { useNotificationCommandListener } from "../notifications/state"

export default function ChatCommandHandlers() {
  useChannelCommandHandler()
  useNotificationCommandListener()
  return null
}
