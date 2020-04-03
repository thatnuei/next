import { observable } from "mobx"
import { ChannelBrowserState } from "../channelBrowser/state"
import { CharacterModel } from "../character/CharacterModel"
import { MapWithDefault } from "../state/MapWithDefault"
import { OverlayModel } from "../ui/OverlayModel"

export class ChatState {
  characters = new MapWithDefault((name) => new CharacterModel(name))
  @observable.shallow friends = new Set<string>()
  @observable.shallow ignored = new Set<string>()
  @observable.shallow admins = new Set<string>()
  channelBrowser = new ChannelBrowserState()
  channelBrowserOverlay = new OverlayModel()
  updateStatus = new OverlayModel()
  sideMenu = new OverlayModel()
}
