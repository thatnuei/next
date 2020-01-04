import { observable } from "mobx"
import { createCommandHandler } from "./helpers"

export class ChatStore {
  @observable admins = new Set<string>()
  @observable ignored = new Set<string>()

  handleSocketCommand = createCommandHandler({
    ADL: ({ ops }) => {
      this.admins = new Set(ops)
    },

    IGN: (params) => {
      switch (params.action) {
        case "init":
        case "list":
          this.ignored = new Set(params.characters)
          break

        case "add":
          this.ignored.add(params.character)
          break

        case "delete":
          this.ignored.delete(params.character)
          break
      }
    },
  })
}
