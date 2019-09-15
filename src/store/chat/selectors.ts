import { State } from ".."
import { createCharacter } from "../../character/helpers"
import { Character } from "../../character/types"

export const getCharacter = (name: string) => (state: State) => {
  const char = state.chat.characters[name] as Character | undefined
  return char || createCharacter(name)
}
