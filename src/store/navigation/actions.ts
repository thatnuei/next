import { Action } from "overmind"

export const showLogin: Action = ({ state }) => {
  state.view = "login"
}
