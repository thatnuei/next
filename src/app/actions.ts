import { Action } from "overmind"

export const showLogin: Action = ({ state }) => {
  state.app.view = "login"
}

export const showCharacterSelect: Action = ({ state }) => {
  state.app.view = "characterSelect"
}

export const showChat: Action = ({ state }) => {
  state.app.view = "chat"
}
