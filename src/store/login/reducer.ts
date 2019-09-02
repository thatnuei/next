import produce from "immer"
import { Action } from "redux"
import { loginError, loginStart, loginSuccess } from "./actions"
import { LoginState } from "./types"

const initialState: LoginState = {
  loading: false,
}

export const loginReducer = produce((state: LoginState, action: Action) => {
  if (loginStart.is(action)) {
    return { loading: true, error: undefined }
  }

  if (loginSuccess.is(action)) {
    return { loading: false }
  }

  if (loginError.is(action)) {
    return { loading: false, error: action.payload.error }
  }
}, initialState)
