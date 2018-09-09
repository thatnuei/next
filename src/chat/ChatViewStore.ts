import { ToggleState } from "../state/ToggleState"

export class ChatViewStore {
  sidebarDisplay = new ToggleState(false)
  userListDisplay = new ToggleState(false)
  channelListDisplay = new ToggleState(false)
}

export const chatViewStore = new ChatViewStore()
