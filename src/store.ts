import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import { navigationReducer } from "./navigationReducer"
import { mergeReducers } from "./redux/helpers"
import { createSocketMiddleware } from "./socketMiddleware"
import { socketReducer } from "./socketReducer"
import { userReducer } from "./userReducer"

export type State = {
  appView: "login" | "characterSelect" | "connecting" | "chat"
  user: {
    account: string
    ticket: string
    characters: string[]
    identity: string
  }
  login: {
    loading: boolean
    error?: string
  }
  characterSelect: {
    loading: boolean
    error?: string
  }
}

const initialState: State = {
  appView: "login",
  user: {
    account: "",
    ticket: "",
    characters: [],
    identity: "",
  },
  login: {
    loading: false,
  },
  characterSelect: {
    loading: false,
  },
}

export function createAppStore() {
  const reducer = mergeReducers(initialState, [
    userReducer,
    navigationReducer,
    socketReducer,
  ])

  return createStore(reducer, applyMiddleware(thunk, createSocketMiddleware()))
}
