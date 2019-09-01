import produce from "immer"
import { AnyAction } from "redux"
import { State } from "../store"
import {
  loginError,
  loginSubmit,
  loginSuccess,
  setIdentity,
} from "./userActions"

export const userReducer = produce((state: State, action: AnyAction) => {
  if (loginSubmit.is(action)) {
    state.login.loading = true
    state.login.error = undefined
  }

  if (loginSuccess.is(action)) {
    state.login.loading = false
    state.user.account = action.account
    state.user.ticket = action.ticket
    state.user.characters = [...action.characters].sort()
    state.appView = "characterSelect"
  }

  if (loginError.is(action)) {
    state.login.loading = false
    state.login.error = action.error
  }

  if (setIdentity.is(action)) {
    state.user.identity = action.identity
  }
})
