import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from "redux-thunk"
import { StateFromReducerMap } from "../redux/StateFromReducerMap"
import { navigationReducer } from "./navigation/reducer"

export type AppState = StateFromReducerMap<typeof reducerMap>

const reducerMap = {
  navigation: navigationReducer,
}

export function createAppStore() {
  const reducer = combineReducers(reducerMap)
  return createStore(reducer, applyMiddleware(thunk))
}
