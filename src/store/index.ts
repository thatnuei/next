import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import { submitLogin } from "../flist/actions"
import { flist } from "../flist/effects"
import { state } from "./state"

const config = {
  state,

  actions: {
    submitLogin,
  },

  effects: {
    flist,
  },
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
