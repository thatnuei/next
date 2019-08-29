import { Dispatch } from "redux"
import { chatServerUrl } from "./fchat/constants"
import {
  commandAction as sendCommandAction,
  parseCommand,
} from "./fchat/helpers"
import { ServerCommand } from "./fchat/types"
import { createAction, createSimpleAction } from "./redux/helpers"
import { createSocketAction, SocketHandlers } from "./socketMiddleware"
import { State } from "./store"

export const chatConnectStart = createSimpleAction("chatConnectStart")
export const chatConnectError = createSimpleAction("chatConnectError")
export const chatConnectSuccess = createSimpleAction("chatConnectSuccess")

export const socketCommand = createAction(
  "socketCommand",
  (command: ServerCommand) => ({ command }),
)

export const socketClosed = createSimpleAction("socketClosed")

export function connectToChat() {
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
