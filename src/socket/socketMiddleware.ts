import { Middleware } from "redux"

export type SocketMiddlewareAction =
  | ReturnType<typeof createSocketAction>
  | ReturnType<typeof sendMessageAction>
  | ReturnType<typeof closeSocketAction>

export type SocketHandlers = {
  onopen: () => void
  onclose: () => void
  onerror: () => void
  onmessage: (event: MessageEvent) => void
}

export const createSocketAction = (url: string, handlers: SocketHandlers) =>
  ({ type: "@@SocketMiddleware/CREATE_SOCKET", url, handlers } as const)

export const sendMessageAction = (message: string) =>
  ({ type: "@@SocketMiddleware/SEND_MESSAGE", message } as const)

export const closeSocketAction = () =>
  ({ type: "@@SocketMiddleware/CLOSE_SOCKET" } as const)

export function createSocketMiddleware(): Middleware {
  let socket: WebSocket | undefined

  function createSocket(url: string, handlers: SocketHandlers) {
    socket = new WebSocket(url)
    socket.onopen = handlers.onopen
    socket.onclose = handlers.onclose
    socket.onerror = handlers.onerror
    socket.onmessage = handlers.onmessage
  }

  function sendMessage(message: string) {
    if (socket) socket.send(message)
  }

  function closeSocket() {
    if (!socket) return

    socket.onopen = null
    socket.onclose = null
    socket.onerror = null
    socket.onmessage = null

    socket.close()
  }

  return () => (next) => (action: SocketMiddlewareAction) => {
    if (action.type === "@@SocketMiddleware/CREATE_SOCKET") {
      createSocket(action.url, action.handlers)
    }
    if (action.type === "@@SocketMiddleware/SEND_MESSAGE") {
      sendMessage(action.message)
    }
    if (action.type === "@@SocketMiddleware/CLOSE_SOCKET") {
      closeSocket()
    }
    return next(action)
  }
}
