import { observable } from "mobx"
import { ChannelModel } from "../channel/state"
import { ChannelBrowserState } from "../channelBrowser/state"
import { CharacterModel } from "../character/state"
import { ChatNavState } from "../chatNav/state"
import { createPrivateChatState } from "../privateChat/private-chat-state"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/state"
import { OverlayModel } from "../ui/OverlayModel"

export type ChatState = ReturnType<typeof createChatState>

export function createChatState() {
  return {
    characters: new MapWithDefault((name) => new CharacterModel(name)),
    channels: new MapWithDefault((id) => new ChannelModel(id)),
    privateChats: new MapWithDefault(createPrivateChatState),

    friends: observable.set<string>(),
    bookmarks: observable.set<string>(),
    ignored: observable.set<string>(),
    admins: observable.set<string>(),

    channelBrowserOverlay: new OverlayModel(),
    sideMenuOverlay: new OverlayModel(),

    channelBrowser: new ChannelBrowserState(),
    nav: new ChatNavState(),
    statusUpdate: new StatusUpdateState(),
  }
}
