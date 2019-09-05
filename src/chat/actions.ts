import { Action } from "overmind"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.chat.identity = identity
  effects.storedIdentity.set(state.user.account, identity)
}
