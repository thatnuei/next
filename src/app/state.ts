import { AppModal } from "./types"

type AppView = "login" | "characterSelect" | "chat"

type AppState = {
  view: AppView
  modal?: AppModal
}

export const state: AppState = {
  view: "login",
}
