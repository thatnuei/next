import { observable } from "mobx"
import { ChannelState } from "../channel/ChannelState"
import { ChannelBrowserState } from "../channelBrowser/ChannelBrowserState"
import { CharacterState } from "../character/CharacterState"
import { ChatNavState } from "../chatNav/state"
import { factoryFrom } from "../common/factoryFrom"
import { PrivateChatState } from "../privateChat/PrivateChatState"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/StatusUpdateState"
import { OverlayState } from "../ui/OverlayState"

export class ChatState {
  characters = new MapWithDefault(factoryFrom(CharacterState))
  channels = new MapWithDefault(factoryFrom(ChannelState))
  privateChats = new MapWithDefault(factoryFrom(PrivateChatState))

  channelBrowserOverlay = new OverlayState()
  sideMenuOverlay = new OverlayState()
  channelBrowser = new ChannelBrowserState()
  nav = new ChatNavState()
  statusUpdate = new StatusUpdateState()

  friends = observable.set<FriendshipInfo>()
  bookmarks = observable.set<string>()
  ignored = observable.set<string>()
  admins = observable.set<string>()

  isFriend = (name: string) =>
    [...this.friends].some((info) => info.them === name)
}

type FriendshipInfo = {
  us: string
  them: string
}
