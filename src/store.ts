import { useSelector } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import { navigationReducer } from "./navigation/navigationReducer"
import { mergeReducers } from "./redux/helpers"
import { createSocketMiddleware } from "./socket/socketMiddleware"
import { socketReducer } from "./socket/socketReducer"
import { userReducer } from "./user/userReducer"

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

function createInitialState(initialize?: (state: State) => State): State {
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

  return initialize ? initialize(initialState) : initialState
}

export function createAppStore() {
  const reducer = mergeReducers(createInitialState(), [
    userReducer,
    navigationReducer,
    socketReducer,
  ])

  return createStore(reducer, applyMiddleware(thunk, createSocketMiddleware()))
}

export function useAppSelector<V>(selector: (state: State) => V) {
  return useSelector(selector)
}
