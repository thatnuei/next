import RootStore from "../RootStore"
import { parseCommand } from "./helpers"
import SocketStore from "./SocketStore"

const createMockSocket = () => {
  type MaybeCallback = null | ((...args: any[]) => void)

  const socket = {
    readyState: WebSocket.CONNECTING,

    onopen: null as MaybeCallback,
    onclose: null as MaybeCallback,
    onmessage: null as MaybeCallback,

    send: (commandString: string) => {
      const command = parseCommand(commandString)
      if (command.type === "IDN") {
        const data = `IDN ${JSON.stringify({ identity: "you" })}`
        socket.onmessage && socket.onmessage({ data })

        setTimeout(() => {
          socket.onmessage && socket.onmessage({ data: "PIN" })
        })
      }
    },

    close: () => {
      socket.readyState = WebSocket.CLOSED
      socket.onclose && socket.onclose()
    },
  }

  setTimeout(() => {
    socket.readyState = WebSocket.OPEN
    socket.onopen && socket.onopen()
  })

  return socket
}

const wait = (ms?: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const setup = () => {
  const root = new RootStore()
  const socket = createMockSocket()
  const store = new SocketStore(root, () => socket as any)
  return { root, socket, store }
}

test("connectToChat - connect and disconnect callbacks", async () => {
  const { store, socket } = setup()

  const onConnect = jest.fn()
  const onDisconnect = jest.fn()

  store.connectToChat(onConnect, onDisconnect)
  await wait(200)

  expect(socket.readyState).toBe(WebSocket.OPEN)

  socket.close()
  await wait(200)

  expect(socket.readyState).toBe(WebSocket.CLOSED)
  expect(onConnect).toHaveBeenCalledTimes(1)
  expect(onDisconnect).toHaveBeenCalledTimes(1)
}, 1000)

test("disconnectFromChat - does nothing if not connected", async () => {
  const { store } = setup()
  expect(() => store.disconnectFromChat()).not.toThrow()
})

test("disconnectFromChat - clears event handlers and closes connection", async () => {
  const { store, socket } = setup()

  store.connectToChat(() => {}, () => {})
  await wait()

  store.disconnectFromChat()
  await wait()

  expect(socket.readyState).toBe(WebSocket.CLOSED)
  expect(socket.onopen).toBeNull()
  expect(socket.onclose).toBeNull()
  expect(socket.onmessage).toBeNull()
})

test("sendSocketCommand - does nothing if not connected", async () => {
  const { store, socket } = setup()
  const spy = jest.spyOn(socket, "send")

  store.sendSocketCommand("JCH", { channel: "Frontpage" })

  expect(spy).not.toHaveBeenCalled()
})

test("sendSocketCommand - sending correct command strings", async () => {
  const { store, socket } = setup()

  store.connectToChat(() => {}, () => {})
  await wait()

  const spy = jest.spyOn(socket, "send")

  store.sendSocketCommand("ORS", undefined)
  expect(spy).toHaveBeenCalledWith("ORS")

  store.sendSocketCommand("JCH", { channel: "Frontpage" })
  expect(spy).toHaveBeenCalledWith(`JCH {"channel":"Frontpage"}`)
})

test("ping", async () => {
  const { store, socket } = setup()
  const spy = jest.spyOn(socket, "send")

  store.connectToChat(() => {}, () => {})
  await wait(100)

  expect(spy).toHaveBeenCalledWith("PIN")
})
