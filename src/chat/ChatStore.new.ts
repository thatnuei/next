import { createCommandHandler } from "./helpers"

export class ChatStore {
  handleSocketCommand = createCommandHandler({
    IDN() {
      console.log("got idn")
    },
  })
}
