import { AppModal } from "../app/types"
import { Channel, ChannelBrowserEntry } from "../channel/types"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"

type AvailableChannels = {
  public: ChannelBrowserEntry[]
  private: ChannelBrowserEntry[]
}

type AsyncState = { loading: boolean; error?: string }

class UserState {
  account = ""
  ticket = ""
  characters: string[] = []
  login: AsyncState = {
    loading: false,
  }
}

class State {
  view: "login" | "characterSelect" | "chat" = "login"
  modal?: AppModal

  user = new UserState()

  // core chat data
  identity = ""
  characters: Dictionary<Character> = {}
  updatingStatus = false
  connecting = false

  get identityCharacter() {
    const characters = this.characters as Dictionary<Character>
    return characters[this.identity] || createCharacter(this.identity)
  }

  // channel data
  channels: Dictionary<Channel> = {}
  availableChannels: AvailableChannels = {
    public: [],
    private: [],
  }
  fetchingPublicChannels = false
  fetchingPrivateChannels = false

  get fetchingAvailableChannels() {
    return this.fetchingPublicChannels || this.fetchingPrivateChannels
  }
}

export const state = new State()
