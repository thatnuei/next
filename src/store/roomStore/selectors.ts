import { State } from ".."

export const getCurrentRoom = () => (state: State) =>
  state.roomStore.currentRoom
