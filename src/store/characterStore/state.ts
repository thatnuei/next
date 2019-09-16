import { Character } from "../../character/types"
import { Dictionary } from "../../common/types"

type CharacterState = {
  characters: Dictionary<Character>
  updatingStatus: boolean
}

export const state: CharacterState = {
  characters: {},
  updatingStatus: false,
}
