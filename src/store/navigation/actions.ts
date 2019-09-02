import { createAction } from "../../redux/createAction"
import { Route } from "./types"

export const setRoute = createAction<Route>("navigation/setRoute")

export const showLogin = () => setRoute({ type: "login" })

export const showCharacterSelect = () => setRoute({ type: "characterSelect" })

export const showChat = () =>
  setRoute({ type: "chat", subRoute: { type: "console" } })
