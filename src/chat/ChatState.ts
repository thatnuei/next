import { observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelBrowserState } from "../channelBrowser/state"
import { CharacterModel } from "../character/CharacterModel"
import { MapWithDefault } from "../state/MapWithDefault"
import { OverlayModel } from "../ui/OverlayModel"
import { ChatNavState } from "./nav"

export class ChatState {
  characters = new MapWithDefault((name) => new CharacterModel(name))

  @observable.shallow friends = new Set<string>()
  @observable.shallow ignored = new Set<string>()
  @observable.shallow admins = new Set<string>()

  @observable.shallow channels: ChannelModel[] = []
  channelBrowser = new ChannelBrowserState()
  channelBrowserOverlay = new OverlayModel()

  nav = new ChatNavState()
  updateStatusOverlay = new OverlayModel()
  sideMenuOverlay = new OverlayModel()
}
