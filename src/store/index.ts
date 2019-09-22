import { Config, createOvermind, IConfig, Overmind } from "overmind"
import { merge, namespaced } from "overmind/config"
import * as actions from "./actions"
import * as effects from "./effects"
import namespaces from "./namespaces"
import { onInitialize } from "./onInitialize"
import { state } from "./state"

export const config = merge(
  { effects, state, actions, onInitialize },
  namespaced(namespaces),
)

export function createAppStore() {
  return createOvermind(config)
}

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export type State = Overmind<Config>["state"]
