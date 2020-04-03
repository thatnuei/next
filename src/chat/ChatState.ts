import { CharacterModel } from "../character/CharacterModel"
import { MapWithDefault } from "../state/MapWithDefault"

export class ChatState {
  characters = new MapWithDefault((name) => new CharacterModel(name))
  friends = new Set<string>()
  ignored = new Set<string>()
  admins = new Set<string>()
}
