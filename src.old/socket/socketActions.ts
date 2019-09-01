import { Dispatch } from "redux"
import { chatServerUrl } from "../fchat/constants"
import { ServerCommand } from "../fchat/types"
import { createAction } from "../redux/helpers"
import { createSocketAction } from "./socketMiddleware"

export const chatConnectStart = createAction("chatConnectStart")
export const chatConnectError = createAction("chatConnectError")
export const chatConnectSuccess = createAction("chatConnectSuccess")

export const socketCommand = createAction(
  "socketCommand",
  (command: ServerCommand) => ({ command }),
)

export const socketClosed = createAction("socketClosed")

export function connectToChat() {
  return (dispatch: Dispatch) => {
    dispatch({ type: "CHAT_CONNECT_START" })
    dispatch(createSocketAction(chatServerUrl))
  }
}
