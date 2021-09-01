import { useChannelCommandListener } from "../channel/state"
import { useNotificationCommandListener } from "../notifications/state"

export default function ChatCommandHandlers() {
  useChannelCommandListener()
  useNotificationCommandListener()
  return null
}
