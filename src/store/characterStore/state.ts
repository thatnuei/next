import { Character } from "../../character/types"
import { Dictionary } from "../../common/types"

type CharacterStoreState = {
  characters: Dictionary<Character>
  updatingStatus: boolean
}

export const state: CharacterStoreState = {
  characters: {},
  updatingStatus: false,
}
