import { createCommandHandler } from "./commands"
import { SocketHandler } from "./SocketHandler"

export class ChatStore {
  constructor(private socket: SocketHandler) {}

  handleCommand = createCommandHandler(this, {
    IDN() {
      this.socket.send({ type: "JCH", params: { channel: "Frontpage" } })
      this.socket.send({ type: "JCH", params: { channel: "Fantasy" } })
      this.socket.send({
        type: "JCH",
        params: { channel: "Story Driven LFRP" },
      })
      this.socket.send({ type: "JCH", params: { channel: "Development" } })
    },
  })
}
