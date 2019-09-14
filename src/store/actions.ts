import { Action } from "overmind"

export const showLogin: Action = ({ state }) => {
  state.view = "login"
}

export const showCharacterSelect: Action = ({ state }) => {
  state.view = "characterSelect"
}

export const showChat: Action = ({ state }) => {
  state.view = "chat"
}
