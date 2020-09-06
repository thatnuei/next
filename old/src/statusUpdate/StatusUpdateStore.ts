import { observable } from "micro-observables"
import { AppStore } from "../app/AppStore"
import { CharacterStatus } from "../character/CharacterModel"
import { delay } from "../helpers/common/delay"
import { createBoundCommandHandler } from "../socket/helpers"
import { SocketHandler } from "../socket/SocketHandler"

export class StatusUpdateStore {
  readonly isVisible = observable(false)
  readonly isSubmitting = observable(false)
  readonly submitDelay = observable(5000)

  constructor(
    private readonly socket: SocketHandler,
    private readonly appStore: AppStore,
  ) {
    socket.commands.subscribe(this.handleCommand)
  }

  show = () => this.isVisible.set(true)
  hide = () => this.isVisible.set(false)

  submit = async (status: CharacterStatus) => {
    if (this.isSubmitting.get()) return

    this.socket.send({
      type: "STA",
      params: { status: status.type, statusmsg: status.text },
    })

    this.isSubmitting.set(true)
    await delay(this.submitDelay.get())
    this.isSubmitting.set(false)
  }

  handleCommand = createBoundCommandHandler(this, {
    VAR({ variable, value }) {
      if (variable === "sta_flood") {
        this.submitDelay.set((Number(value) || 5) * 1000) // value is in seconds
      }
    },

    STA({ character }) {
      if (character === this.appStore.identity.get()) {
        this.isVisible.set(false)
      }
    },
  })
}
