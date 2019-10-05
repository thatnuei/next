import { createHook } from "overmind-react"
import { config } from "./index"

export const useStore = createHook<typeof config>()
