import produce from "immer"
import { Action } from "redux"
import {
  chatConnectError,
  chatConnectStart,
  chatConnectSuccess,
} from "./socketActions"
import { State } from "./store"

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
