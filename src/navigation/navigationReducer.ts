import produce from "immer"
import { Action } from "redux"
import { State } from "../store"
import { returnToLogin } from "./navigationActions"

export function navigationReducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    if (returnToLogin.is(action)) {
      draft.appView = "login"
    }
  })
}
