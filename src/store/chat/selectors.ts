import { State } from ".."

export const getCharacter = (name: string) => (state: State) =>
  state.chat.characters[name]
