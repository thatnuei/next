import { observable } from "mobx"
import { ChannelModel } from "../channel/state"
import { ChannelBrowserState } from "../channelBrowser/state"
import { CharacterModel } from "../character/state"
import { RoomListModel } from "../chatNav/state"
import { PrivateChatModel } from "../privateChat/state"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/state"
import { OverlayModel } from "../ui/OverlayModel"

export class ChatState {
  characters = new MapWithDefault((name) => new CharacterModel(name))

  @observable.shallow friends = new Set<string>()
  @observable.shallow ignored = new Set<string>()
  @observable.shallow admins = new Set<string>()

  channels = new MapWithDefault((id) => new ChannelModel(id))
  channelBrowser = new ChannelBrowserState()
  channelBrowserOverlay = new OverlayModel()

  privateChats = new MapWithDefault((name) => new PrivateChatModel(name))

  roomList = new RoomListModel()

  sideMenuOverlay = new OverlayModel()

  statusUpdate = new StatusUpdateState()
}
