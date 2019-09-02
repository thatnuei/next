import { produce } from "immer"
import { Action } from "redux"
import { loginSuccess } from "../login/actions"
import { setRoute } from "./actions"
import { NavigationState } from "./types"

export const initialState: NavigationState = {
  route: { type: "login" },
}

export const navigationReducer = produce(
  (state: NavigationState, action: Action) => {
    if (setRoute.is(action)) {
      state.route = action.payload
    }

    if (loginSuccess.is(action)) {
      state.route = { type: "characterSelect" }
    }
  },
  initialState,
)
