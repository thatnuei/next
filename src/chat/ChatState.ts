import { CharacterState } from "../character/CharacterState"
import { ChatNavState } from "../chatNav/state"
import { factoryFrom } from "../helpers/common/factoryFrom"
import { PrivateChatState } from "../privateChat/PrivateChatState"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/StatusUpdateState"
import { OverlayState } from "../ui/OverlayState"

export class ChatState {
  characters = new MapWithDefault(factoryFrom(CharacterState))
  privateChats = new MapWithDefault(factoryFrom(PrivateChatState))

  sideMenuOverlay = new OverlayState()
  nav = new ChatNavState()
  statusUpdate = new StatusUpdateState()
}
