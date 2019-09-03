import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from "redux-thunk"
import { StateFromReducerMap } from "../redux/types/StateFromReducerMap"
import { loginReducer } from "./login/reducer"
import { navigationReducer } from "./navigation/reducer"
import { userReducer } from "./user/reducer"

export type AppState = StateFromReducerMap<typeof reducerMap>

const reducerMap = {
  navigation: navigationReducer,
  user: userReducer,
  login: loginReducer,
}

export function createAppStore() {
  const reducer = combineReducers(reducerMap)
  return createStore(reducer, applyMiddleware(thunk))
}
