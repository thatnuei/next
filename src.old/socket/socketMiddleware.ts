import { Action, Middleware } from "redux"
import { createAction } from "../redux/helpers"

export const socketOpened = createAction("socketOpened")
export const socketClosed = createAction("socketClosed")
export const socketError = createAction("socketError")
export const socketMessage = createAction(
  "socketMessage",
  (event: MessageEvent) => ({ event }),
)

export const createSocketAction = createAction(
  "createSocket",
  (url: string) => ({ url }),
)

export const sendMessageAction = createAction(
  "sendMessage",
  (message: string) => ({ message }),
)

export const disconnectAction = createAction("closeSocket")

export function createSocketMiddleware(): Middleware {
  return (store) => {
    let socket: WebSocket | undefined

    function createSocket(url: string) {
      socket = new WebSocket(url)

      socket.onopen = () => {
        store.dispatch(socketOpened())
      }

      socket.onclose = () => {
        store.dispatch(socketClosed())
      }

      socket.onerror = () => {
        store.dispatch(socketError())
      }

      socket.onmessage = (event: MessageEvent) => {
        store.dispatch(socketMessage(event))
      }
    }

    function sendMessage(message: string) {
      if (socket) socket.send(message)
    }

    function disconnect() {
      if (!socket) return

      socket.onopen = null
      socket.onclose = null
      socket.onerror = null
      socket.onmessage = null

      socket.close()
    }

    return (next) => (action: Action) => {
      if (createSocketAction.is(action)) {
        createSocket(action.url)
      }

      if (sendMessageAction.is(action)) {
        sendMessage(action.message)
      }

      if (disconnectAction.is(action)) {
        disconnect()
      }

      return next(action)
    }
  }
}
