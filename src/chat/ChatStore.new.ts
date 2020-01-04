import { createCommandHandler } from "./helpers"

export class ChatStore {
  handleSocketCommand = createCommandHandler({
    IDN() {
      // join last rooms and such
    },
  })
}
