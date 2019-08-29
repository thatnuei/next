import produce from "immer"
import { Action } from "redux"
import { State } from "../store"
import {
  chatConnectError,
  chatConnectStart,
  chatConnectSuccess,
} from "./socketActions"

export function socketReducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    if (chatConnectStart.is(action)) {
      draft.appView = "connecting"
    }
    if (chatConnectError.is(action)) {
      draft.appView = "characterSelect"
      draft.characterSelect.error = "Failed to connect"
    }
    if (chatConnectSuccess.is(action)) {
      draft.appView = "chat"
    }
  })
}
