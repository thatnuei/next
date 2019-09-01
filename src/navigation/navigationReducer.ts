import produce from "immer"
import { Action } from "redux"
import { State } from "../store"
import { returnToLogin } from "./navigationActions"

export const navigationReducer = produce((state: State, action: Action) => {
  if (returnToLogin.is(action)) {
    state.appView = "login"
  }
})
