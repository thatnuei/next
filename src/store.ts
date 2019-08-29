import produce from "immer"
import { Action, applyMiddleware, createStore, Dispatch } from "redux"
import thunk from "redux-thunk"
import extractErrorMessage from "./common/extractErrorMessage"
import { chatServerUrl } from "./fchat/constants"
import {
  commandAction as sendCommandAction,
  parseCommand,
} from "./fchat/helpers"
import { ServerCommand } from "./fchat/types"
import {
  ApiResponse,
  getTicketUrl,
  LoginResponse,
} from "./flist/FListApiService"
import { fetchJson } from "./network/fetchJson"
import { createAction, createSimpleAction } from "./redux/helpers"
import {
  createSocketAction,
  createSocketMiddleware,
  SocketHandlers,
} from "./socketMiddleware"

type State = {
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

const setIdentity = createAction("setIdentity", (identity: string) => ({
  identity,
}))

const returnToLogin = createSimpleAction("returnToLogin")

const chatConnectStart = createSimpleAction("chatConnectStart")
const chatConnectError = createSimpleAction("chatConnectError")
const chatConnectSuccess = createSimpleAction("chatConnectSuccess")

const socketCommand = createAction(
  "socketCommand",
  (command: ServerCommand) => ({ command }),
)

const socketClosed = createSimpleAction("socketClosed")

const loginSubmit = createSimpleAction("loginSubmit")

const loginSuccess = createAction(
  "loginSuccess",
  (account: string, ticket: string, characters: string[]) => ({
    account,
    ticket,
    characters,
  }),
)

const loginError = createAction("loginError", (error: string) => ({ error }))

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

function submitLogin(account: string, password: string) {
  return async (dispatch: Dispatch) => {
    dispatch(loginSubmit())

    try {
      const res = await fetchJson<ApiResponse<LoginResponse>>(getTicketUrl, {
        method: "post",
        body: { account, password },
      })

      if (!("ticket" in res)) {
        throw new Error(res.error)
      }

      const { ticket, characters } = res
      dispatch(loginSuccess(account, ticket, characters))
    } catch (error) {
      dispatch(loginError(extractErrorMessage(error)))
    }
  }
}

function connectToChat() {
  return (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: "CHAT_CONNECT_START" })

    const handlers: SocketHandlers = {
      onopen() {
        const { account, ticket, identity } = getState().user
        dispatch(
          sendCommandAction("IDN", {
            account,
            ticket,
            character: identity,
            cname: "next",
            cversion: "0.0.1",
            method: "ticket",
          }),
        )
      },

      onclose() {
        dispatch(socketClosed())
      },

      onerror() {
        dispatch(chatConnectError())
      },

      onmessage(event) {
        const command = parseCommand(event.data)

        if (command.type === "IDN") {
          dispatch(chatConnectSuccess())
        }

        if (command.type === "PIN") {
          dispatch(sendCommandAction("PIN", undefined))
        }

        dispatch(socketCommand(command))
      },
    }

    dispatch(createSocketAction(chatServerUrl, handlers))
  }
}

function reducer(state = initialState, action: Action): State {
  return produce(state, (draft) => {
    if (loginSubmit.is(action)) {
      draft.login.loading = true
      draft.login.error = undefined
    }

    if (loginSuccess.is(action)) {
      draft.login.loading = false
      draft.user.account = action.account
      draft.user.ticket = action.ticket
      draft.user.characters = action.characters.sort()
      draft.appView = "characterSelect"
    }

    if (loginError.is(action)) {
      draft.login.loading = false
      draft.login.error = action.error
    }

    if (setIdentity.is(action)) {
      draft.user.identity = action.identity
    }

    if (returnToLogin.is(action)) {
      draft.appView = "login"
    }

    if (chatConnectStart.is(action)) {
      draft.appView = "connecting"
    }

    if (chatConnectError.is(action)) {
      draft.appView = "characterSelect"
      draft.characterSelect.error = "Failed to connect"
    }

    if (chatConnectSuccess.is(action)) {
      draft.appView = "chat"
    }
  })
}

export function createAppStore() {
  return createStore(reducer, applyMiddleware(thunk, createSocketMiddleware()))
}
