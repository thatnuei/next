import produce from "immer"
import { Action } from "redux"
import { State } from "../store"
import {
  chatConnectError,
  chatConnectStart,
  chatConnectSuccess,
} from "./socketActions"

export const socketReducer = produce((state: State, action: Action) => {
  if (chatConnectStart.is(action)) {
    state.appView = "connecting"
  }

  if (chatConnectError.is(action)) {
    state.appView = "characterSelect"
    state.characterSelect.error = "Failed to connect"
  }

  if (chatConnectSuccess.is(action)) {
    state.appView = "chat"
  }
})
