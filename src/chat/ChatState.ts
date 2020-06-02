import { CharacterState } from "../character/CharacterState"
import { factoryFrom } from "../helpers/common/factoryFrom"
import { MapWithDefault } from "../state/MapWithDefault"

export class ChatState {
  characters = new MapWithDefault(factoryFrom(CharacterState))
}
