import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import * as appActions from "../app/actions"
import * as chatActions from "../chat/actions"
import { identityStorage } from "../chat/effects"
import * as fchatActions from "../fchat/actions"
import { socket } from "../fchat/effects"
import * as flistActions from "../flist/actions"
import { flist } from "../flist/effects"
import { onInitialize } from "./onInitialize"
import { state } from "./state"

const config = {
  state,

  actions: {
    ...flistActions,
    ...chatActions,
    ...appActions,
    ...fchatActions,
  },

  effects: {
    flist,
    identityStorage,
    socket: socket(),
  },

  onInitialize,
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
