import produce from "immer"
import { Action } from "redux"
import { State } from "../store"
import {
  loginError,
  loginSubmit,
  loginSuccess,
  setIdentity,
} from "./userActions"

export function userReducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    if (loginSubmit.is(action)) {
      draft.login.loading = true
      draft.login.error = undefined
    }

    if (loginSuccess.is(action)) {
      draft.login.loading = false
      draft.user.account = action.account
      draft.user.ticket = action.ticket
      draft.user.characters = [...action.characters].sort()
      draft.appView = "characterSelect"
    }

    if (loginError.is(action)) {
      draft.login.loading = false
      draft.login.error = action.error
    }

    if (setIdentity.is(action)) {
      draft.user.identity = action.identity
    }
  })
}
