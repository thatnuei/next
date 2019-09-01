import { Dispatch } from "redux"
import { ServerCommand } from "../fchat/types"
import { createAction } from "../redux/helpers"
import { State } from "../store"

export const chatConnectStart = createAction("chatConnectStart")
export const chatConnectError = createAction("chatConnectError")
export const chatConnectSuccess = createAction("chatConnectSuccess")

export const socketCommand = createAction(
  "socketCommand",
  (command: ServerCommand) => ({ command }),
)

export const socketClosed = createAction("socketClosed")

export function connectToChat() {
  return (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: "CHAT_CONNECT_START" })

    // const handlers = {
    //   onopen() {
    //     const { account, ticket, identity } = getState().user
    //     dispatch(
    //       sendCommandAction("IDN", {
    //         account,
    //         ticket,
    //         character: identity,
    //         cname: "next",
    //         cversion: "0.0.1",
    //         method: "ticket",
    //       }),
    //     )
    //   },

    //   onclose() {
    //     dispatch(socketClosed())
    //   },

    //   onerror() {
    //     dispatch(chatConnectError())
    //   },

    //   onmessage(event) {
    //     const command = parseCommand(event.data)

    //     if (command.type === "IDN") {
    //       dispatch(chatConnectSuccess())
    //     }

    //     if (command.type === "PIN") {
    //       dispatch(sendCommandAction("PIN", undefined))
    //     }

    //     dispatch(socketCommand(command))
    //   },
    // }

    // dispatch(createSocketAction(chatServerUrl, handlers))
  }
}
