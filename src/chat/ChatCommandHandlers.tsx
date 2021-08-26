import { observer } from "mobx-react-lite"
import { useChannelCommandListener } from "../channel/state"
import { useChannelBrowserCommandListener } from "../channelBrowser/state"
import { useCharacterCommandListener } from "../character/state"
import { useNotificationCommandListener } from "../notifications/state"
import { usePrivateChatCommandHandler } from "../privateChat/state"

export default observer(function ChatCommandHandlers() {
  useCharacterCommandListener()
  useChannelBrowserCommandListener()
  useChannelCommandListener()
  usePrivateChatCommandHandler()
  useNotificationCommandListener()
  return null
})
