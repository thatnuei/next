import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import * as characterActions from "./character/actions"
import * as chatActions from "./chat/actions"
import { identityStorage } from "./chat/effects"
import * as fchatActions from "./fchat/actions"
import { socket } from "./fchat/effects"
import * as flistActions from "./flist/actions"
import { flist } from "./flist/effects"
import * as navigationActions from "./navigation/actions"
import { onInitialize } from "./onInitialize"
import { state } from "./state"
import * as uiActions from "./ui/actions"

const config = {
  state,

  actions: {
    ...flistActions,
    ...chatActions,
    ...navigationActions,
    ...characterActions,
    ...fchatActions,
    ...uiActions,
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
