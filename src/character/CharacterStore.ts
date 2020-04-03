import { MapWithDefault } from "../state/MapWithDefault"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = new MapWithDefault((name) => new CharacterModel(name))

  getCharacter = (name: string) => this.characters.get(name)
}
