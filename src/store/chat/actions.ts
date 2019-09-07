import { Action } from "overmind"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.chat.identity = identity
  effects.identityStorage.set(state.user.account, identity)
}
