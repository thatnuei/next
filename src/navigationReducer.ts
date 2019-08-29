import produce from "immer"
import { Action } from "redux"
import { returnToLogin } from "./navigationActions"
import { State } from "./store"

export function navigationReducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    if (returnToLogin.is(action)) {
      draft.appView = "login"
    }
  })
}
