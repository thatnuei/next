import produce from "immer"
import { observable } from "micro-observables"
import * as mobx from "mobx"
import { ChannelState } from "../channel/ChannelState"
import { ChannelBrowserState } from "../channelBrowser/ChannelBrowserState"
import { CharacterState } from "../character/CharacterState"
import { CharacterGender, CharacterStatus } from "../character/types"
import { ChatNavState } from "../chatNav/state"
import { factoryFrom } from "../common/factoryFrom"
import { Dict } from "../common/types"
import { PrivateChatState } from "../privateChat/PrivateChatState"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/StatusUpdateState"
import { OverlayState } from "../ui/OverlayState"

export class ChatState {
  characters = observable<Dict<CharacterState>>({})
  channels = new MapWithDefault(factoryFrom(ChannelState))
  privateChats = new MapWithDefault(factoryFrom(PrivateChatState))

  channelBrowserOverlay = new OverlayState()
  sideMenuOverlay = new OverlayState()
  channelBrowser = new ChannelBrowserState()
  nav = new ChatNavState()
  statusUpdate = new StatusUpdateState()

  friends = mobx.observable.set<FriendshipInfo>()
  bookmarks = mobx.observable.set<string>()
  ignored = mobx.observable.set<string>()
  admins = mobx.observable.set<string>()

  isFriend = (name: string) =>
    [...this.friends].some((info) => info.them === name)

  characterActions = new CharacterActions(this)
}

class CharacterActions {
  constructor(private state: ChatState) {}

  get = (name: string) =>
    this.state.characters.get()[name] || new CharacterState(name)

  setGender = (name: string, gender: CharacterGender) => {
    this.state.characters.update(
      produce((dict: Dict<CharacterState>) => {
        const char = (dict[name] = dict[name] || new CharacterState(name))
        char.gender = gender
      }),
    )
  }

  setStatus = (
    name: string,
    status: CharacterStatus,
    statusMessage: string,
  ) => {
    this.state.characters.update(
      produce((dict: Dict<CharacterState>) => {
        const char = (dict[name] = dict[name] || new CharacterState(name))
        char.status = status
        char.statusMessage = statusMessage
      }),
    )
  }
}

type FriendshipInfo = {
  us: string
  them: string
}
