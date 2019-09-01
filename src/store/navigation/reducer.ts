import { produce } from "immer"
import { Action } from "redux"
import { setRoute } from "./actions"
import { NavigationState } from "./types"

export const initialState: NavigationState = {
  route: { type: "login" },
}

export const navigationReducer = produce(
  (state: NavigationState, action: Action) => {
    if (setRoute.is(action)) {
      state.route = action.payload.route
    }
  },
  initialState,
)
