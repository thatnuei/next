import { OnInitialize } from "overmind"

export const onInitialize: OnInitialize = async ({ actions }) => {
  actions.chat.addSocketListeners()
}
