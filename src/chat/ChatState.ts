import { CharacterState } from "../character/CharacterState"
import { factoryFrom } from "../helpers/common/factoryFrom"
import { PrivateChatState } from "../privateChat/PrivateChatState"
import { MapWithDefault } from "../state/MapWithDefault"
import { StatusUpdateState } from "../statusUpdate/StatusUpdateState"

export class ChatState {
  characters = new MapWithDefault(factoryFrom(CharacterState))
  privateChats = new MapWithDefault(factoryFrom(PrivateChatState))

  statusUpdate = new StatusUpdateState()
}
