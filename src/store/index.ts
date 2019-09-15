import { Config, createOvermind, IConfig, Overmind } from "overmind"
import { merge, namespaced } from "overmind/config"
import * as actions from "./actions"
import * as chat from "./chat"
import * as effects from "./effects"
import { onInitialize } from "./onInitialize"
import { state } from "./state"
import * as user from "./user"

export const config = merge(
  { effects, state, actions, onInitialize },
  namespaced({
    user,
    chat,
  }),
)

export function createAppStore() {
  return createOvermind(config)
}

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export type State = Overmind<Config>["state"]
