import { createAction } from "../../helpers/redux/createAction"
import { Route } from "./types"

export const setRoute = createAction<{ route: Route }>("navigation/setRoute")
