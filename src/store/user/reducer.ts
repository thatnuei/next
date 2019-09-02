import produce from "immer"
import { Action } from "redux"
import { loginSuccess } from "../login/actions"
import { UserState } from "./types"

export const initialState: UserState = {
  account: "",
  ticket: "",
  characters: [],
}

export const userReducer = produce((state: UserState, action: Action) => {
  if (loginSuccess.is(action)) {
    const { account, ticket, characters } = action.payload
    state.account = account
    state.ticket = ticket
    state.characters = [...characters].sort()
  }
}, initialState)
